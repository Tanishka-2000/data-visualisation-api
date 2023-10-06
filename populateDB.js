const jsonData = require('./jsondata.json');
const mongoose = require('mongoose');
require('dotenv').config()
const Schema = mongoose.Schema;

mongoose.connect(process.env.MONGODB_URL);

const articleSchema = new Schema({
    end_year : String,
    intensity : Number,
    sector : String,
    topic : String,
    insight : String,
    url : String,
    region : String,
    start_year : String,
    impact : String,
    added : Date,
    published : Date,
    country : String,
    relevance : Number,
    pestle : String,
    source : String,
    title : String,
    likelihood : Number
});

const Article = mongoose.model('Article', articleSchema);

// saving data
jsonData.forEach(data => {

    const article = new Article({
        end_year: data.end_year,
        intensity: data.intensity,
        sector: data.sector,
        topic: data.topic,
        insight: data.insight,
        url: data.url,
        region: data.region,
        start_year: data.start_year,
        impact: data.impact,
        added: data.added,
        published: data.published,
        country: data.country,
        relevance: data.relevance,
        pestle: data.pestle,
        source: data.source,
        title: data.title,
        likelihood: data.likelihood
    });

    article.save()
    .then(() =>  console.log('saved!'))
    .catch(err => console.log(err))
})