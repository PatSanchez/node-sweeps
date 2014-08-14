module.exports = function(app){
    app.get("/", function(req, res){
        app.rest.get('https://embed-8430.secondstreetapp.com/api/promotion_contents?organizationPromotionUniqueId=c7d1ba85-ab89-4bab-826e-35f997a68f95',
            {
                headers: app.headers
            })
            .on('complete', function(result){
                var unpacked = result.promotion_contents[0];
                unpacked.master_page_template_content = unpacked.master_page_template_content.replace(
                    /href="\/staticcontent\//gi, 
                    'href="https://sanchezmedia.secondstreetapp.com/staticcontent/'
                );
                res.render('index', unpacked);
            });
        
    });
};