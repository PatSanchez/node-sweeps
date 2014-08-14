module.exports = function(app){
    app.get("/sweeps/:guid", function(req, res) {
        res.redirect('/sweeps/' + req.params.guid + '/enter');
    });
};