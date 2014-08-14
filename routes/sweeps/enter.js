module.exports = function(app){
    app.get("/sweeps/:guid/enter", function(req, res){
        
        
        app.rest.get('https://sanchezmedia.secondstreetapp.com/api/promotion_contents?organizationPromotionUniqueId=' + req.params.guid,
            {
                headers: app.headers
            }
        )
        .once('complete', function(result){
            var promotionContents, settings, matchups, render, forms;
            promotionContents = result.promotion_contents[0];
            render = function(){
                if(settings && matchups && forms){
                    res.render('sweeps/enter', {
                        master_page_template_content: promotionContents.master_page_template_content,
                        settings: settings,
                        matchups: matchups,
                        forms: forms
                    });
                }
            };
            promotionContents.master_page_template_content = promotionContents.master_page_template_content.replace(
                /href="\/staticcontent\//gi,
                'href="https://sanchezmedia.secondstreetapp.com/staticcontent/'
            );
            //From those contents, add additional headers
            app.headers['X-Organization-Id'] = promotionContents.organization_id;
            app.headers['X-Organization-Promotion-Id'] = promotionContents.organization_promotion_id;
            app.headers['X-Promotion-Id'] = promotionContents.promotion_id;
            
            //Then get some more stuff
            //In theory, should be able to do all of this simultaneously
            app.rest.get('https://sanchezmedia.secondstreetapp.com/api/settings?category=UI_Text', 
                {
                    headers: app.headers
                }
            )
            .once('complete',function(result){
                settings = result.settings;
                render();
            });
                
            app.rest.get('https://sanchezmedia.secondstreetapp.com/api/matchups',
                {
                    headers: app.headers
                }
            )
            .once('complete',function(result){
                matchups = result.matchups;
                render();
            });

            app.rest.get('https://sanchezmedia.secondstreetapp.com/api/forms',
                {
                    headers: app.headers
                }
            )
            .once('complete',function(result){
                forms = result.forms;
                render();
            });
            
        });

    });
};