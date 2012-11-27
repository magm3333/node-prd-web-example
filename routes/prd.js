exports.list = function(req, res, nPrd){
	//var qs=require('url').parse(req.url).query;
	//console.log(qs.data);
	var path=require('path');
	var pathOut=require('path').resolve(__dirname+'/../public/out');
	var pathReports=path.resolve(__dirname+'/../reports');
	console.log(JSON.stringify(req.body));
	var json=req.body;
	var fileout=new Date().getTime();	
	console.log(json.data);	
	var type=''
	if(json.outputType=='ExcelXLS')
		type='xls';
	else if(json.outputType=='ExcelXLSX')
		type='xlsx';
	else
		type=json.outputType;
	var htmlFolder='';
	if(type=='html')
		htmlFolder='htmlOut';
	var otherConfig={
		reportBundlePath:  path.join(pathReports,'report.prpt'),
		outputFilePath: path.join(pathOut,fileout+''),
		outputType: type,
		htmlFolder:htmlFolder,
		params: [
			{name : 'title', value : json.title, type  : 'String'},
		],
		dataFactory : {
			type : 'NamedStatic',
			columnNames : ['zone','customer','sales'],
			columnTypes : ['String','String','Double'],
			data : json.data
		}
	};
	nPrd.setConfig(otherConfig);
	nPrd.runRaaS(function(data){
		var r={};
		if(data.code==0){
			r.msg='OK';
			if(type=='html')
				r.file='out/'+htmlFolder+'/'+fileout+'.'+type;
			else
				r.file='out/'+fileout+'.'+type;
		} else {
			r.msg='ERROR';
		}
		res.send(JSON.stringify(r));
	});
	
};