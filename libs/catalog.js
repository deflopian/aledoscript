function isEmpty( el ){
    return !$.trim(el.html())
}

$(function(){
    catalogClient.init();
});


;(function ($) {
    $.fn.bindImageLoad = function (callback) {
        function isImageLoaded(img) {
            // Во время события load IE и другие браузеры правильно
            // определяют состояние картинки через атрибут complete.
            // Исключение составляют Gecko-based браузеры.
            if (!img.complete) {
                return false;
            }
            // Тем не менее, у них есть два очень полезных свойства: naturalWidth и naturalHeight.
            // Они дают истинный размер изображения. Если какртинка еще не загрузилась,
            // то они должны быть равны нулю.
            if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
                return false;
            }
            // Картинка загружена.
            return true;
        }

        return this.each(function () {
            var ele = $(this);
            if (ele.is("img") && $.isFunction(callback)) {
                ele.one("load", callback);
                if (isImageLoaded(this)) {
                    ele.trigger("load");
                }
            }
        });
    };
})(jQuery);


var catalogClient = {
    scrollToProduct: false,
    scrollToSeries: false,
    scrollToSubsection: false,
    pid: 0,

    init: function()
    {
        this.initScrollMenu();
        this.initPopupShow();
        /*$(window).on('popstate', function(e) {
            window.location.href = history.location.href;
        });*/
    },

    initScrollMenu: function()
    {
        $('.catalog-submenu').find('a').on('click', function(e){
            e.preventDefault();
            var href = $(this).attr('href');
            var id = jQuery.url(href).param('p');
            var container = $('#' + id);
            history.pushState({id:id}, "", href);
            mainpage.scrollTo(container);

        });
    },

    initPopupShow: function()
    {

        $('body').on('aledo.popup.success', function(){

            popup.initSeriesPopup();
            catalogClient.initProductLink();

            filter.popupShown();
        });
    },

    initProductLink: function()
    {
        var modal = $('#popupModal');

        var pid = 1;
        modal.on('shown.bs.modal', function () {
            popup.renderCartedLines();
            if(pid){
                //var container = $('tr[data-id="'+pid+'"]');
                var container = $('.selectedProd');
                if (container.length) {
                    $('.modal').animate({ scrollTop: container.offset().top}, 600);
                    container.addClass('highlighted');
                }

            }
        });
    },


    getYearForm: function(year) {
        var res = '';
        if (year == 0) {
            res = 'лет';
        } else if (year == 1) {
            res = 'год';
        } else if (year >= 2 && year <= 4) {
            res = 'года';
        } else if (year >= 5 && year <= 20) {
            res = 'лет';
        }
        return res;
    },

    initUrl: function()
    {
        var prodScroll = catalogClient.scrollToProduct;
        var serScroll = catalogClient.scrollToSeries;
        var subsScroll = catalogClient.scrollToSubsection;
        var container = null;


//        if ($('.drivers_pic').length > 0) {
//            var offs = 0;
//            $('.drivers_pic').bindImageLoad(function () {
//                offs += $(this).height();
////                console.log('подгрузились изображения и сдвинули весь этот бордель на ' + offs.toString() + ' пикселей');
//                if(prodScroll){
//                    var prodLine = $('.product-line[data-id="' + prodScroll + '"]');
//
//                    console.log(prodLine);
//                    prodLine.addClass('highlighted');
//                    mainpage.scrollTo(prodLine, 50, true);
//
//                } else if(serScroll){
//                    container = $('.series-block[data-id="'+ serScroll +'"]');
//                    mainpage.scrollTo(container);
//                } else if (subsScroll) {
//                    container = $('#subsec-'+subsScroll);
//                    mainpage.scrollTo(container);
//                }
//            });
//        } else {
            if(prodScroll){
                var prodLine = $('.product-line[data-id="' + prodScroll + '"]');

                console.log(prodLine);
                prodLine.addClass('highlighted');
                mainpage.scrollTo(prodLine, 50, true);

            } else if(serScroll){
                container = $('.series-block[data-id="'+ serScroll +'"]');
                mainpage.scrollTo(container);
            } else if (subsScroll) {
                container = $('#subsec-'+subsScroll);
                console.log(container);
                mainpage.scrollTo(container);
            }
        //}



    }
};


var filter = {
    slidersData: {},
    postVals: {},
    filterData: {},
    filterResult: {},
    section_id: 0,
    subsection_id: 0,
    prefilterResult: {},
    prefilterInputChanged: 0,
    filterResultFieldId: '#filter-result',
    filterFormId: '#f-form',
    filterBodyId: '#filter-body',
    filterBarPlaceId: '#catalog-filterbar-place',
    popupOpened: false,
    smallFilter: false,
    tableFilter: false,

    init: function(options)
    {
        this.slidersData = options.slidersData || {};
        this.postVals = options.postVals || {};
        this.section_id = options.section_id;
        this.subsection_id = options.subsection_id || 0;
        this.smallFilter = options.smallFilter == true;
        this.tableFilter = options.tableFilter == true;

        this.initSliders();
        this.initCheckBoxes();
        this.initPanels();
        this.initFilterBarTemplate();
        this.initFilterButton();
        this.initOnchangePrefilter();
        this.disableButton();

        //if(this.subsection_id){
            this.initUrledFilter();
        //}
    },

    // поведение панельки фильтра
    initPanels: function()
    {
        $('.panel-catalog-filter').not('.disabled').children('.panel-heading').click(function(e){
            if(e.target.nodeName == 'DIV'){
                $(this).find('.panel-title').trigger('click');
            }
        });
    },

    // инициализация слайдеров
    initSliders: function()
    {
        var field;
        var data;
        var startVal;
        var endVal;
        $('.noUiSlider').each(function(){
            field = $(this).closest('.b-filter-form__panel').data('field');
            data = filter.slidersData[field];
            var isEmpty = false;

            if(!$.isEmptyObject(data)){
                startVal = parseInt(data['min']);
                endVal = parseInt(data['max']);

                if((startVal || endVal) && (startVal != endVal)){
                    $(this).noUiSlider({
                        range: [startVal,endVal]
                        ,start: [startVal,endVal]
                        ,connect: true
                        ,margin: 1
                        ,serialization: {
                            mark: ','
                            ,resolution: 1
                            ,to: [
                                $("#f-"+ field +"-val-from"),
                                $("#f-"+ field +"-val-to")
                            ]
                        }
                    }).on('change', function(){
                            $('.catalog-filter').trigger('aledo.filter.changed', [$(this)]);
                        });

                    $("#f-"+ field +"-val-from").on('change', function(){
                        $('.catalog-filter').trigger('aledo.filter.changed.text', [$(this)]);
                    });

                    $("#f-"+ field +"-val-to").on('change', function(){
                        $('.catalog-filter').trigger('aledo.filter.changed.text', [$(this)]);
                    });
                } else { isEmpty = true; }
            } else { isEmpty = true; }

            if(isEmpty){
                console.log(field + ' is empty');
                $('.b-filter-form__panel[data-field='+field+']').addClass('disabled');
            }
        });
    },

    // инициализация чекбоксов
    initCheckBoxes: function()
    {
        $('.panel-body[data-type="checkbox"]').each(function(){
            if(isEmpty($(this))){
                $(this).closest('.b-filter-form__panel').addClass('disabled');
            }
        }).on('change', function(){
                $('.catalog-filter').trigger('aledo.filter.changed', [$(this)]);
            }) ;
    },

    // фильтрация на лету при изменении значения. выводит поповер с количеством найденного хлама.
    initOnchangePrefilter: function()
    {
        $('#f-instock').on('change', function(){ $('.catalog-filter').trigger('aledo.filter.changed', [$(this)]); }) ;
        $('#f-offers').on('change', function(){ $('.catalog-filter').trigger('aledo.filter.changed', [$(this)]); }) ;

        $('.catalog-filter').on('aledo.filter.changed', function(event, elem){
            console.log('filtering on the fly');

            var vals = filter.gatherFormVals();

            filter.removeDefaultValues(vals);

            if(!filter.smallFilter){
                if(!filter.isNewData(vals)){
                    console.log('default data set');
                    $('.catalog-filter').popover('destroy');
                    filter.disableButton();
                    return;
                }
                filter.enableButton();
                filter.makeFilter(vals, filter.renderPrefilterResult);
                filter.prefilterInputChanged = elem;
            } else {
                if(!filter.isNewData(vals)){
                    filter.resetFilter();
                    return;
                }
                filter.filterData = vals;
                var resFunc = filter.tableFilter ? filter.renderTableFilterResult : filter.renderFilterResult;
                filter.makeFilter(filter.filterData, resFunc);
            }

        });

        $('.catalog-filter').on('aledo.filter.changed.text', function(event, elem){
            console.log('filtering from text input fields');

            var vals = filter.gatherFormVals();
            filter.removeDefaultValues(vals);
            if (filter.isDefault(vals)){

            }

            if(!filter.smallFilter){
                if(!filter.isNewData(vals)){
                    console.log('default data set');
                    $('.catalog-filter').popover('destroy');
                    filter.resetFilter();
                    filter.disableButton();
                    return;
                }
                if (filter.isNewData(vals)) {
                    filter.enableButton();
                }
            }
        });
    },

    isDefault: function() {

    },

    // отрисовка шаблона плашки
    initFilterBarTemplate: function()
    {
        var tmlt =
            '<div class="row row-second" id="filter-result" style="display: none">' +
                '<div class="col-md-12"><div class="filter-container"><div class="row"><div class="col-md-3">' +
                '<h4>Применен фильтр:</h4></div>' +
                '<div class="col-md-6" id="filter-body"></div>' +
                '<div class="col-md-3">' +
                '<div class="filter-elem-remove pull-right"><span class="filter-elem-title">Отменить фильтр</span>' +
                '<span id="filter-remove" class="aledo-cross-white"></span></div>' +
            '</div></div></div></div></div>';

        $(tmlt).insertBefore(this.filterBarPlaceId);
        $('#filter-remove').click(function(e){
            e.preventDefault();
            filter.resetFilter();
        });
    },

    // кнопка "применить фильтр"
    initFilterButton: function()
    {
        $(this.filterFormId).on('submit', function(e){
            e.preventDefault();

            filter.filterData = filter.gatherFormVals();

            filter.removeDefaultValues(filter.filterData); // дерьмовый второй перебор, что бы избавится от дефолтных значений

            if(!filter.isNewData(filter.filterData)){
                console.log('data didnt change');
                return;
            }

            filter.makeFilter(filter.filterData, filter.renderFilterResult);
        });
    },

    // получение всех значений с формы
    gatherFormVals: function()
    {
        var form = $(this.filterFormId);

        var vals = {};
        vals['instock'] = $('#f-instock').prop("checked") ? 1 : 0;
        vals['offers'] = $('#f-offers').prop("checked") ? 1 : 0;

        var name;
        form.find('input:checked').each(function(){
            name = $(this).attr('name');
            // проверка, что бы не цеплялись значения instock и offers
            if(name){
                if(!vals[name]){
                    vals[name] = [];
                }
                vals[name].push($(this).val());
            }
        });

        form.find('.b-filter-form__panel').not('.disabled').find('.noUiSlider').each(function(){
            vals[$(this).data('name')] = $(this).val();
        });

        return vals;
    },

    // выключение кнопки "отправить"
    disableButton: function()
    {
        $(this.filterFormId).find('button').attr('disabled','disabled');
    },

    // ее же включение
    enableButton: function()
    {
        $(this.filterFormId).find('button').removeAttr('disabled');
    },

    // аякс отправляющий значения на фильтрацию
    makeFilter: function(filterData, successFunction)
    {
        console.log('filtering');

        var data = filterData;
        data['ajax'] = 1;
        data['section_id'] = this.section_id;
        data['subsection_id'] = filter.subsection_id;

        console.log('sent data:');

        $.ajax({
            'url' :     '/catalog/getproducts/',
            'dataType': 'json',
            'type':     'post',
            'data':     data,
            'success':  function(data){
                if(data.success == 1){
                    console.log('got data:');
                    successFunction(data);
                } else {
                    showError();
                }
            }
        });
    },



    // отрисовка результатов фильтра - отрисовка плашки + скрытие серий
    renderFilterResult: function(data)
    {
        console.log('rendering filter result');
        var newData = filter.filterData;
        newData['subsection_id'] = $(this).data('id');

        history.pushState(null,  null, '?filter=' + encodeURIComponent(JSON.stringify(newData)));
        //filter.initSubsecBarClick();
        //location.href = '?filter=' + encodeURIComponent(JSON.stringify(newData));
        filter.renderFilterBar();
        filter.initSubsecBarClick();

        var seriesBlocks = $('.series-tile');
        seriesBlocks.show();

        var serid;
        if(data.series_ids){
            filter.filterResult = data.series_ids;
            seriesBlocks.each(function(){
                serid = $(this).data('id');
                if(!filter.filterResult[serid]){
                    $(this).fadeOut(500);
                }

                if(filter.popupOpened && jQuery.url().param('bid') == serid){
                    $('.product-line-disabler').remove();
                    filter.renderFilterProductDisablers(serid);
                }
            });
        } else {
            seriesBlocks.fadeOut(600);
            console.log('nothing found');
        }
    },

    // отрисовка результатов фильтра для страниц только с таблицами (ленты/питание)
    renderTableFilterResult: function(data)
    {
        console.log('rendering tablefilter result');
        filter.renderFilterBar();

        $('.unnecessary').fadeOut(500);
        $('.product-line-disabler').remove();

        var seriesBlocks = $('.series-block');
        seriesBlocks.show();

        var serid;
        if(data.series_ids){
            filter.filterResult = data.series_ids;
            seriesBlocks.each(function(){
                serid = $(this).data('id');
                if(!filter.filterResult[serid]){
                    $(this).fadeOut(500);
                }
                filter.renderTableFilterProductDisablers($(this), serid);
            });
        } else {
            seriesBlocks.fadeOut(600);
            console.log('nothing found');
        }
    },

    // отображение всплывающей подсказки при фильтрации налету
    renderPrefilterResult: function(data)
    {
        console.log('rendering prefilter result');
        var ser_count, prod_count, filterBlock, content, offsetTop, parent, btnAction, offsetDelta;

        ser_count = data['count_series'] || 0;
        prod_count = data['count_products'] || 0;

        if(ser_count){
            content = '<p>серий:'+ ser_count +'</p><p>моделей:'+ prod_count +'</p>' +
                '<p><a href="#" id="prefilter-btn" class="link">показать</a></p>';
            btnAction = 'show';
        } else {
            content = '<p>ничего не найдено :(</p><p><a href="#" id="prefilter-btn" class="link">отменить</a></p>';
            btnAction = 'dismiss';
        }

        if(filter.prefilterInputChanged.closest('.b-filter-form__panel').length>0){
            parent = filter.prefilterInputChanged.closest('.b-filter-form__panel');
            offsetDelta = filter.subsection_id ? 140 : 185;
            offsetTop = parent.offset().top - offsetDelta;
        } else {
            parent = filter.prefilterInputChanged.parent();
            offsetDelta = filter.subsection_id ? 140 : 235;
            offsetTop = parent.offset().top - offsetDelta;
        }

        filterBlock = $('.catalog-filter');

        filterBlock.popover('destroy');
        filterBlock.popover({
            placement: 'right',
            trigger: 'manual',
            html: true,
            content: content
        });
        filterBlock.popover('show');
        filterBlock.next('.popover').css('top', offsetTop).addClass('prefilter-show').append('<div class="aledo-arrow-prefilter"></div>');

        $('#prefilter-btn').on('click', function(e){
            e.preventDefault();
            if(btnAction == 'show'){
                $(filter.filterFormId).submit();
            } else {
                filter.resetFilter();
            }
        });

    },

    // переход на подраздел с оставлением фильтра
    initSubsecBarClick: function()
    {
        if(filter.tableFilter){ return; }

        $('.catalog-section-bar').on('click', function(e){
            e.preventDefault();

            var newData = filter.filterData;
            newData['subsection_id'] = $(this).data('id');

            location.href = $(this).attr('href') + '?filter=' + encodeURIComponent(JSON.stringify(newData));
        })
    },

    // применяет фильтр из урла
    initUrledFilter: function()
    {
        var urledData = $.url().param('filter');
        if(urledData){
            console.log('rendering urled filter');
            filter.filterData = JSON.parse(urledData);

            delete filter.filterData['ajax'];
            delete filter.filterData['section_id'];
            delete filter.filterData['subsection_id'];

            filter.showUrledValsOnInputs(filter.filterData);
            console.log(filter.filterData);
            filter.makeFilter(filter.filterData, filter.renderFilterResult);
        }
    },

    // визуально отображает значнеия примененного фильтра
    showUrledValsOnInputs: function(vals)
    {
        console.log("showing urled filter on inputs");

        var val,panel, showPanel = false;
        for(var field in vals){
            val = vals[field];
            panel = $('.b-filter-form__panel[data-field='+field+']');

            if(field == 'instock'){
                if(val != 0){
                    $('#f-instock').attr('checked', true);
                    showPanel = true;
                }
            } else if(field == 'offers'){
                if(val != 0){
                    $('#f-offers').attr('checked', true);
                    showPanel = true;
                }
            } else if(this.slidersData[field]){
                panel.find('.noUiSlider').val([val[0],val[1]]);
                showPanel = true;
            } else { // чекбоксы остальные
                for(var i in val){
                    $('#f-'+field+'-val-'+val[i]).attr('checked', true);
                }
                showPanel = true;
            }

            if(showPanel){
                panel.find('.panel-collapse').collapse('hide');
            }
        }
    },

    // отрисовка плашки фильтра
    renderFilterBar: function()
    {
        $(filter.filterBodyId).html('');
        $('.catalog-filter').popover('destroy');
        $(filter.filterResultFieldId).fadeIn(600);

        var val, data, filterElem, str;
        for(var field in this.filterData){
            str = '';
            val = this.filterData[field];
            if(field == 'instock'){
                if(val != 0){
                    str = 'только в наличии';
                }
            } else if(field == 'offers'){
                if(val != 0){
                    str = 'спецпредложения';
                }
            } else if(this.slidersData[field]){
                str = val[0] + ' - ' + val[1] + ' ' + this.postVals[field];
            } else { // чекбоксы остальные
                var lolstr;
                for(var i in val){
                    lolstr = $('label[for=f-'+field+'-val-'+val[i]+']').text();
                    if(lolstr){
                        this.renderFilterElem(lolstr, field);
                    }
                }
            }

            if(str){ this.renderFilterElem(str, field); }
        }

        this.initRemoveFilterElemButton();
    },

    // отрисовка на плашке фильтра одной позиции фильтрации (прямоугольничек с крестиком)
    renderFilterElem: function(text, field)
    {
        var elem = $(
            '<div class="filter-elem" data-field="'+ field +'">' +
                '<span class="filter-elem-title">'+ text +'</span>' +
                '<span class="aledo-cross-white filter-remove-elem"></span>' +
                '</div>'
        );

        $(this.filterBodyId).append(elem);
    },

    // отмена фильтра
    resetFilter: function()
    {
        filter.filterData = {};
        filter.filterResult = {};
        $(filter.filterResultFieldId).fadeOut(600);
        $('.series-tile').fadeIn(600);

        filter.disableButton();

        var data, field;
        $(filter.filterFormId).find('input[type=checkbox]').attr('checked', false);
        $('.noUiSlider').each(function(){
            field = $(this).closest('.b-filter-form__panel').data('field');
            data = filter.slidersData[field];
            $(this).val([data['min'],data['max']]);
        });

        $('.panel-collapse').each(function(){
            //force-open - фильтры, открытые через админку
            if($(this).hasClass('in') && !$(this).hasClass('force-open')){
                $(this).collapse('hide');
            }
        });

        $('.catalog-filter').popover('destroy');

        if(filter.popupOpened || filter.tableFilter){
            $('.product-line-disabler').fadeOut(600);
        }

        if(filter.tableFilter){
            $('.series-block').fadeIn(500);
            $('.unnecessary').fadeIn(500);
        }
    },

    // проверяется, отличны ли значения фильтрации от дефолтных
    isNewData: function(filterData)
    {
        var isNew = false;
        var val, data;

        for(var field in filterData){
            val = filterData[field];
            if(field == 'instock' || field == 'offers'){
                if(val != 0){
                    isNew = true;
                    break;
                }
            } else if(this.slidersData[field]){
                data = this.slidersData[field];
                if(val[0] != data['min'] || val[1] != data['max']){
                    isNew = true;
                    break;
                }
            } else { // чекбоксы остальные
                isNew = true;
                break;
            }
        }

        return isNew;
    },

    // из массива фильтрации убираются значения равные дефолтным.
    removeDefaultValues: function(filterData)
    {
        var val, data;
        for(var field in filterData){
            val = filterData[field];
            if(this.slidersData[field]){
                data = this.slidersData[field];

                if(val[0] == data['min'] && val[1] == data['max']){
                    delete filterData[field];
                }
            }
        }
    },

    // клик на крестик у элемента фильтрации в строке фильтра (отмена одного фильтра)
    initRemoveFilterElemButton: function()
    {
        var field, panel, data, val;
        $('.filter-remove-elem').click(function(){
            if(filter.isLastFilterBar()){
                console.log('filter empty');
                filter.resetFilter();
                return;
            }

            field = $(this).parent().data('field');
            panel = $('.b-filter-form__panel[data-field='+field+']');
            if(field == 'instock' || field == 'offers'){
                $('#f-'+field).attr('checked', false);
                delete filter.filterData[field];
            } else if(filter.slidersData[field]){
                data = filter.slidersData[field];
                panel.find('.panel-collapse').collapse('hide');
                panel.find('.noUiSlider').val([data['min'],data['max']]);
                delete filter.filterData[field];
            } else { // чекбоксы остальные
                // магия больного сознания
                val = $(this).prev('span').text();
                var newVals = [];
                $('#f-'+field).find('label').each(function(){
                    if($(this).text() == val){
                        var input = $('#'+$(this).attr('for'));
                        input.attr('checked', false);
                        for(var i in filter.filterData[field]){
                            if(filter.filterData[field][i] != input.val()){
                                newVals.push(filter.filterData[field][i]);
                            }
                        }
                        filter.filterData[field] = newVals;
                    }
                });
                if(newVals.length == 0){
                    panel.find('.panel-collapse').collapse('hide');
                    delete filter.filterData[field];
                }
            }

            delete filter.filterData['ajax'];
            delete filter.filterData['section_id'];
            delete filter.filterData['subsection_id'];

            if(!filter.isNewData(filter.filterData)){
                console.log('filter empty');
                filter.resetFilter();
                return;
            }

            filter.makeFilter(filter.filterData, filter.renderFilterResult);
        });
    },

    isLastFilterBar: function()
    {
        return $(this.filterBodyId).find('.filter-elem-title').length == 1;
    },

    // по открытию попапа (не по отрисовке) (срабатывает при открытии и переходе на другие попапы)
    popupShown: function()
    {
        filter.popupOpened = true;
        filter.renderFilterProductResult();

        $('#popupModal').on('hide.bs.modal', filter.moveFilterToDefaultPos);
        $('body').on('aledo.popup.prevnext', filter.moveFilterToDefaultPos);
    },

    moveFilterToDefaultPos: function()
    {
        filter.popupOpened = false;
        $(filter.filterResultFieldId).insertBefore(filter.filterBarPlaceId);
    },

    // отрисовка фильтра для продуктов в открытом попапе
    renderFilterProductResult: function()
    {
        $(filter.filterResultFieldId).insertBefore('#serpopup-table-container');

        //var serid = $.url().param('bid');
        var segments = jQuery.url().segment();
        var serid = 0;
        if (segments.length == 3) {
            serid = segments[2];
        }

        window.setTimeout( function(){ filter.renderFilterProductDisablers(serid); }, 300 );
    },

    renderFilterProductDisablers: function(serid)
    {
        console.log(filter.filterResult);
        console.log(serid);
        if( !$.isEmptyObject(filter.filterResult) ){
            var pid;
            var disabler;
            $('.product-line').each(function(){
                pid = $(this).children('td:first-child').text();
                if(!filter.filterResult[serid] || $.inArray(pid, filter.filterResult[serid]) == -1){

                    disabler = $("<div>").addClass('product-line-disabler');
                    disabler.height($(this).outerHeight()).width($(this).width());
                    disabler.insertBefore($(this));
                }
            });
        }
    },

    renderTableFilterProductDisablers: function(serBlock, serid)
    {

        if( !$.isEmptyObject(filter.filterResult) ){
            var pid;
            var disabler;
            serBlock.find('.product-line').each(function(){
                pid = $(this).children('td:first-child').text();

                if(!filter.filterResult[serid] || $.inArray(pid, filter.filterResult[serid]) == -1){

                    disabler = $("<div>").addClass('product-line-disabler');
                    disabler.height($(this).outerHeight()).width($(this).width());
                    disabler.insertBefore($(this));
                }
            });
        }
    }
};