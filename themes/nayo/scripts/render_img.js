let cheerio = require('cheerio'),
    placeHolder = '/images/placeholder.png';


function renderImg(source) {

    let $ = cheerio.load(source, {
            decodeEntities: false
        }),
        gallery = $('.gallery,.banner'),
        img = $('img');

    gallery.each((idx, element) => {

        let origin = $(element).attr('data-origin');

        if (origin && origin !== placeHolder) {

            $(element).attr({
                'data-src': origin
            });
            $(element).css('background-image', `url("${placeHolder}")`);
            $(element).addClass('lazyload');

        }
    });

    img.each((idx, element) => {
        let el = $(element);
        if (el.hasClass('donate-img')) {
            return true;
        }
        let src = el.attr('src');

        if (src && src !== placeHolder) {
            el.attr({
                'data-src': src,
                'src': placeHolder
            });
        }

        el.addClass('lazyload');
    });

    return $.html()
}

hexo.extend.filter.register('after_render:html', renderImg);