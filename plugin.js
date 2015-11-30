;(function ($, window, undefined) {
    'use strict';

    var methods = {
        data: function () {
            methods.enableFields.call(this);
            var data = this.find('.rows .row').map(function () {
                var $row = $(this);
                return {
                    UserId: $row.find('select.users-select').val(),
                    TagId: $row.find('select.tags-select').val()
                };
            }).get().filter(function (row) {
                return row.UserId !== '';
            });
            methods.disableFields.call(this);
            return data;
        },
        enableFields: function () {
            this.find('.rows .row select.users-select').each(function () {
                $(this).find('option').prop('disabled', false);
            });
        },
        disableFields: function () {
            var disabledUsersIds = this.find('.rows .row select.users-select').map(function () {
                return $(this).val();
            }).get();

            this.find('.rows .row select.users-select').each(function () {
                for (var i = 0; i < disabledUsersIds.length; i++) {
                    $(this).find('option[value="' + disabledUsersIds[i] + '"]').prop('disabled', true);
                }
            });
        }
    };

    $.fn.userTagList = function (options) {

        if (typeof methods[options] === 'function') {
            return methods[options].call(this);
        } else {
            return this.each(function () {
                var $this = $(this),

                    users = [], tags = [],
                    defaults = $.extend({
                        data: {
                            '': null
                        }
                    }, options || {});

                var overrides = {
                    beforeAdd: function () {
                    },
                    beforeRemove: function ($row) {
                    },
                    afterRemove: function () {
                    },
                    afterAdd: function ($row) {
                    }
                };

                function select(rows, key, options) {
                    var $select = $('<select/>', $.extend({}, options || {})).clone();
                    $select.append($.map(rows, function (row) {
                        return $('<option/>', {
                            val: row.Id,
                            text: row.Name
                        }).clone();
                    }));
                    $select.val(key);
                    $select.on('change', selectChanged);
                    return $select;
                }

                function selectChanged(ev) {
                    overrides.beforeAdd();
                    // aneble all selects
                    methods.enableFields.call($this);

                    var emptyRowsCount = $this.find('.rows .row select.users-select').filter(function () {
                        return $(this).val() === '';
                    }).length;
                    if (emptyRowsCount === 0) {
                        var $rows = $this.find('.rows');
                        var $row = $('<div/>', {class: 'row'}).clone();
                        $row.append(select(users, '', {class: 'users-select'}));
                        $row.append(select(tags, '', {class: 'tags-select'}));
                        $row.append(removeBtn());
                        $rows.append($row);
                    }
                    methods.disableFields.call($this);
                    overrides.afterAdd($row);
                }

                function removeBtn() {
                    var btn = $('<i/>', {
                        class: 'fa fa-minus',
                        text: '-'
                    }).clone();

                    btn.on('click', function () {
                        overrides.beforeRemove($(this).closest('.row'));
                        $(this).closest('.row').remove();
                        overrides.afterRemove();
                        selectChanged();
                    });
                    return btn;
                }

                $this.render = function () {
                    var $rows = $('<div/>', {class: 'rows'}).clone(),
                        $row,
                        data = defaults.data;

                    if (data[''] === undefined) {
                        data[''] = null;
                    }
                    for (var key in data) {
                        $row = $('<div/>', {class: 'row'}).clone();
                        $row.append(select(users, key, {class: 'users-select'}));
                        $row.append(select(tags, data[key], {class: 'tags-select'}));
                        $row.append(removeBtn());
                        $rows.append($row);
                        overrides.afterAdd($row);
                    }

                    $this.html($rows);
                    methods.disableFields.call($this);
                };

                overrides = $.extend({}, overrides, options || {});

                (function init() {
                    if (defaults.url === undefined || defaults.url === null) {
                        throw new Error('Url is not defined!');
                    }
                    $.ajax({
                        url: defaults.url,
                        dataType: 'json',
                        success: function (data) {
                            users = data.Users;
                            tags = data.Tags;

                            users.push({Id: '', Name: ''});
                            tags.push({Id: '', Name: ''});

                            $this.render();
                        }
                    });
                })();
            });
        }
    };
})(jQuery);