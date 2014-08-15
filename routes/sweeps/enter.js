module.exports = function(app){
    app.get("/sweeps/:guid/enter", function(req, res){
        
        //Determines if the contest is active and when the next round is
        var contestStatus = {
            isActive: function(matchups){
                var contestActive = false;
                var now = new Date();
                matchups.forEach(function(matchup){
                    var startDate = new Date(matchup.start_date);
                    var endDate = matchup.end_date ? new Date(matchup.end_date) : new Date('9999-07-28T17:01:41.28');
                    if(now > startDate && now < endDate){
                        contestActive = true;
                    }
                });
                return contestActive;
            },
            nextRoundStart: function(matchups){
                var nextRound = null;
                var now = new Date();
                matchups.forEach(function(matchup){
                    var startDate = new Date(matchup.start_date);
                    var endDate = matchup.end_date ? new Date(matchup.end_date) : new Date('9999-07-28T17:01:41.28');
                    if(startDate > now){
                        if(nextRound !== null){
                            if(startDate < nextRound){
                                nextRound = startDate;
                            }
                        }
                        else {
                            nextRound = startDate;
                        }
                    }
                });
                return nextRound;
            }
        };
        
        
        app.rest.get('https://sanchezmedia.secondstreetapp.com/api/promotion_contents?organizationPromotionUniqueId=' + req.params.guid,
            {
                headers: app.headers
            }
        ).once('complete', 
            function(result){
                var promotionContents, settings, matchups, render, forms, opHeaders;
                promotionContents = result.promotion_contents[0];
                var test = function(input){
                    console.log(input);    
                };
                //The render function we will eventually use
                render = function(){
                    if(settings && matchups && forms){
                        res.render('sweeps/enter', {
                            master_page_template_content_top: promotionContents.master_page_template_content_top,
                            master_page_template_content_bottom: promotionContents.master_page_template_content_bottom,
                            settings: settings,
                            matchups: matchups,
                            forms: forms,
                            isActive: contestStatus.isActive(matchups),
                            nextRoundStart: contestStatus.nextRoundStart(matchups)
                        });
                    }
                };
                promotionContents.master_page_template_content = promotionContents.master_page_template_content.replace(
                    /href="\/staticcontent\//gi,
                    'href="https://sanchezmedia.secondstreetapp.com/staticcontent/'
                );
                
                //This splits the template contents into a top and bottom so we can inject the form in between
                promotionContents.master_page_template_content_top = promotionContents.master_page_template_content.split(
                    '<form'
                )[0];
                promotionContents.master_page_template_content_bottom = promotionContents.master_page_template_content.split(
                    '</form>'
                )[1];
                    
                //From those contents, add additional headers
                opHeaders = JSON.parse(JSON.stringify(app.headers));
                opHeaders['X-Organization-Id'] = promotionContents.organization_id;
                opHeaders['X-Organization-Promotion-Id'] = promotionContents.organization_promotion_id;
                opHeaders['X-Promotion-Id'] = promotionContents.promotion_id;
                
                //Then get some more stuff
                app.rest.get('https://sanchezmedia.secondstreetapp.com/api/settings?category=UI_Text', 
                    {
                        headers: opHeaders
                    }
                )
                .once('complete',
                    function(result){
                        settings = result.settings;
                        render();
                    }
                );
                    
                app.rest.get('https://sanchezmedia.secondstreetapp.com/api/matchups',
                    {
                        headers: opHeaders
                    }
                )
                .once('complete',
                    function(result){
                        matchups = result.matchups;
                        render();
                    }
                );
    
                app.rest.get('https://sanchezmedia.secondstreetapp.com/api/forms',
                    {
                        headers: opHeaders
                    }
                )
                .once('complete',
                    function(result){
                        var tempForms = result.forms;
                        var formFieldGroups = result.form_field_groups;
                        var formFields = result.form_fields;
                        var fields = result.fields;
                        
                        //Converting sideloaded data to nested data
                        formFields.forEach(function(formField){
                            fields.forEach(function(field){
                                if(formField.field_id === field.id){
                                    formField.nestedField = field;
                                }
                            });  
                        });

                        formFieldGroups.forEach(function(ffg){
                            ffg.nestedFormFields = [];
                            formFields.forEach(function(formField){
                                if(ffg.form_fields.indexOf(formField.id) > -1){
                                    ffg.nestedFormFields.push(formField);
                                }
                            })
                        });

                        tempForms.forEach(function(form){
                            form.nestedGroups = [];
                            formFieldGroups.forEach(function(ffg){
                                if(form.form_field_groups.indexOf(ffg.id) > -1){
                                    form.nestedGroups.push(ffg);
                                }
                            })
                        });
                        forms = tempForms;
                        render();
                    }
                );
                
            }
        );

    });
};