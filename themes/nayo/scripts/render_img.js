let cheerio = require('cheerio'),
    placeHolder = '/images/placeholder.gif',
    startedLoad = 3;


function renderImg(source) {

    let $ = cheerio.load(source),
        gallery = $('.gallery,.banner'),
        img = $('img');

    gallery.each((idx, element) => {

        let origin = $(element).attr('data-origin');

        if (origin && origin !== placeHolder) {

            if (idx >= startedLoad) {

                $(element).attr({
                    'data-src': origin
                });

                $(element).addClass('lazyload');
                $(element).css('background-image', 'url("' + placeHolder + '")');
            } else {

                $(element).css('background-image', 'url("' + origin + '")');
            }

        }
    });

    img.slice(startedLoad).each((idx, element) => {

        let src = $(element).attr('src');

        if (src && src !== placeHolder) {
            $(element).attr({
                'data-src': src,
                'src': placeHolder
            });
        }

        $(element).addClass('lazyload');
    });

    return $.html();
}


hexo.extend.filter.register('after_render:html', renderImg);