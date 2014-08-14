module.exports = function(app){
    app.get("/sweeps/:guid/thanks", function(req, res){
        app.rest.get('https://sanchezmedia.secondstreetapp.com/api/promotion_contents?organizationPromotionUniqueId=' + req.params.guid,
            {
                headers: app.headers
            })
            .once('complete', function(result){
                var unpacked = result.promotion_contents[0];
                unpacked.master_page_template_content = unpacked.master_page_template_content.replace(
                    /href="\/staticcontent\//gi,
                    'href="https://sanchezmedia.secondstreetapp.com/staticcontent/'
                );
                res.render('sweeps/enter', unpacked);
            });

    });
};