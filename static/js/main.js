function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function (xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();

function disableRow(el) {
    $(el).find('.btn').prop('disabled', 'disabled');
    $(el).addClass('disabled');
}

function enableRow(el) {
    $(el).find('.btn').removeAttr('disabled');
    $(el).removeClass('disabled');
}

function refreshNotificationsPanel() {
    if ($('#notification-list .panel-body').children().length > 0) {
        $('#notification-list').show();
    } else {
        $('#notification-list').hide();
    }
}

function addNotification(text, type) {
    var el = '<p class="bg-{type}">{text}</p>'.replace('{type}', type).replace('{text}', text);
    $('#notification-list .panel-body').append(el);
}

function removeFiles(files) {
    $.ajax({
        type: "POST",
        url: "delete/",
        data: {'files[]': files},
        success: function (data) {
            for (i = 0; i < data.files.length; i++) {
                var checkbox = $('[value="' + data.files[i].name + '"]');
                if (data.files[i].status == 'ok') {
                    $(checkbox).parent().parent().remove();
                } else {
                    enableRow($(checkbox).parent().parent());
                    addNotification('Ошибка удаления. Файл ' + data.files[i].name + ' не существует', 'danger');
                    refreshNotificationsPanel();
                }
            }
        }
    });
}

$(document).ready(function () {

    refreshNotificationsPanel();

    $('[data-toggle="popover"]').popover();

    $('#check_all').click(function (e) {
        if ($(this).prop('checked')) {
            $('td input:checkbox').prop('checked', 'checked');
        } else {
            $('td input:checkbox').removeAttr('checked');
        }
    });

    $(".file-upload input[type=file]").change(function () {
        for (var i = 0; i < this.files.length; i++) {
            var filename = this.files[i].name;
            $('.file-list').append('<li class="file">' + filename + '</li>');
        }
    });

    $('#close_notifications').click(function () {
        $('#notification-list').hide();
        $('#notification-list .panel-body').html('');
    });

    $('table').on('click', 'tr', function (e) {
        if (e.target.nodeName == 'TD') {
            $(this).find('input[type="checkbox"]').click()
        }
    });

    $('table').on('click', '.remove-file', function () {
        var row = $(this).parent().parent();
        var file_name = row.find('input[type="checkbox"]').val();
        disableRow(row);
        removeFiles([file_name]);
    });

    $('#remove_files').click(function () {
        var files = [];
        $('td input:checkbox:checked').each(function (index, el) {
            files.push($(this).val());
            disableRow($(el).parent().parent());
        });
        removeFiles(files);
    });
});