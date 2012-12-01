
/*
 * GET home page.
 */

exports.index = function(req, res, prdHomeOK){
	if(prdHomeOK)
		res.render('index', { title: 'node-prd example' });
	else
		res.render('noPrdHome', 
				{ title: 'node-prd example', 
					label: 'Variable PRD_HOME is not set or contains a wrong value' });
};
