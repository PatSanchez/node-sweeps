module.exports = function(app){
    app.get("/organization/:id", function(req, res){
        app.rest.get('https://sanchezmedia.secondstreetapp.com/api/organizations/' + req.params.id,
            {
                headers: app.headers
            })
            .on('complete', function(result){
                var organization_promotions = [];
                result.organization_promotions.forEach(function(op){
                    var promotionId = op.promotion_id;
                    var combined = op;
                    result.promotions.forEach(function(p){
                        if(p.id === promotionId){
                            combined.promotion = p;
                        }
                    });
                    organization_promotions.push(combined);
                });
                var sweeps = organization_promotions.filter(function(el){
                    if(el.promotion){
                        return el.promotion.promotion_type_id === 5;
                    }
                    return false;
                });
                res.render('organization', {
                    organization: result.organizations[0],
                    organization_promotions: sweeps
                });
            });

    });
};