const parallel = require('async/parallel');
const router = require('express').Router();
const Article = require('../models/article');

const filters = {
    '$likelihood' : 'number',
    '$relevance' : 'number',
    '$sector' : 'string',
    '$pestle' : 'string',
    '$region' : 'string',
    '$topic' : 'string',
    '$country' : 'string'
}

router.get('/overview', async (req, res) => {
    let result = await getOverview(1,1);
    res.json(result)
});

router.post('/overview/filter', async (req, res) => {

    const {filter, value} = req.body;
    let newFilter = '$' + filter;
    let newValue = filters[newFilter] === 'string' ? value : Number(value);
    let result = await getOverview( newFilter, newValue );
    res.json(result)
})


async function getOverview(filter, value){
    try{
        let result = await parallel({
            total: function(callback){
                Article.countDocuments({$expr: {$eq : [filter, value]}}).then(total => callback(null, total))
            },
            totalSector: function(callback){
                Article.distinct('sector', {$expr: {$eq : [filter, value]}}).then(result => callback(null, result.length))
            },
            totalSources: function(callback){
                Article.distinct('source', {$expr: {$eq : [filter, value]}}).then(result => callback(null, result.length))
            },
            others: function(callback){
                Article.aggregate()
                .match({$expr: {$eq : [filter, value]}})
                .facet({
                    publishedYear: [{$project: { _id: 0,year: {$year: '$published'}}},
                        { $group: {_id: '$year',count: {$count: {}}}},
                        { $sort: {_id: 1}}],
                    relevance: [{ $group : {_id: '$relevance', count: {$count: {}}}}, {$sort: {_id: 1}}],
                    country: [{ $group : {_id: '$country', count: {$count: {}}}}, {$sort: {count: -1}}],
                    likelihood: [{ $group : {_id: '$likelihood', count: {$count: {}}}}],
                    topic: [{ $group : {_id: '$topic', count: {$count: {}}}}, {$sort: {count: -1}}],
                    pestle: [{ $group : {_id: '$pestle', count: {$count: {}}}}],
                    regions: [{ $group : {_id: '$region', count: {$count: {}}}}, {$sort: {count: -1}}],
                })
                .then(result => callback(null, result));
            }
        });
    return result;

    }catch(e){
        return e;
    }
}

router.get('/topic', (req ,res) => {
    Article.distinct('topic')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get('/region', (req ,res) => {
    Article.distinct('region')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});


router.get('/country', (req ,res) => {
    Article.distinct('country')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get('/relevance', (req, res) => {
    Article.distinct('relevance')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get('/pestle', (req, res) => {
    Article.distinct('pestle')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get('/sector', (req, res) => {
    Article.distinct('sector')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get('/likelihood', (req, res) => {
    Article.distinct('likelihood')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

router.get('/source', (req, res) => {
    Article.distinct('source')
    .then(result => res.json(result))
    .catch(err => console.log(err));
});

// router.get('/intensity', (req, res) => {

//     Article.aggregate([
//         {
//             $project: {
//                 _id : 0,
//                 'range': {
//                     $switch: {
//                         branches: [
//                           {
//                             case: { $lte : [ '$intensity', 10 ] },
//                             then: "1 - 10"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 10 ] },
//                                              { $lte : [ '$intensity', 20 ] } ] },
//                             then: "11 - 20"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 20 ] },
//                                              { $lte : [ '$intensity', 30 ] } ] },
//                             then: "21 - 30"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 30 ] },
//                                              { $lte : [ '$intensity', 40 ] } ] },
//                             then: "31 - 40"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 40 ] },
//                                              { $lte : [ '$intensity', 50 ] } ] },
//                             then: "41 - 50"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 50 ] },
//                                              { $lte : [ '$intensity', 60 ] } ] },
//                             then: "51 - 60"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 60 ] },
//                                              { $lte : [ '$intensity', 70 ] } ] },
//                             then: "61 - 70"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 70 ] },
//                                              { $lte : [ '$intensity', 80 ] } ] },
//                             then: "71 - 80"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 80 ] },
//                                              { $lte : [ '$intensity', 90 ] } ] },
//                             then: "81 - 90"
//                           },
//                           {
//                             case: { $and : [ { $gt : [ '$intensity', 90 ] },
//                                              { $lte : [ '$intensity', 100 ] } ] },
//                             then: "91 - 100"
//                           },
//                         ],
//                         default: '$intensity'
//                     }
//                 }
//             }
//         },
//         {
//             $group: {
//                 _id: '$range',
//                 count: { $count: {} }
//             }
//         },
//         {
//             $sort: {_id : 1}
//         }
//     ])
//     .then(data => res.json(data))
//     .catch(err => console.log(err));
// });

module.exports = router;