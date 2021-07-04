const express =require ('express');
const router =express.Router();
const Person = require('../model/personSchema')

//create and save a Record of a model:
router.post('/newperson',(req,res) =>{
    let newperson= new Person (req.body)
    newperson.save((err,data)=>{
        err ? console.log(err) :res.send('person was created')
    })
})
//create several people with Model.create(), using the function arrgument array of people
var createManyPeople=function(arrayOfPeople,done)
{
    Person.create(arrayOfPeople,(err,data)=>err ?console.log(err):done(null,data));
}

router.post('/ManyPerson',(req,res)=>{
    createManyPeople(req.body,(err,data)=>{
        err ? console.log(err):res.send('ManyPerson was created')
    }
    )
})

//use model.find() to search YOUR DATABASE
router.get('/:name',(req,res)=>{
    Person.find({name:req.params.name},(err,data)=>{
        err? console.log(err) : res.json(data) 
    }) 
})
//use model.findOne() to find just one person
router.get('/getFavorite/:favoriteFoods',(req,res)=>
{
    console.log('get favorite')
    Person.findOne({favoriteFoods:{$elemMatch:{$eq:req.params.favoriteFoods}}},(err,data)=>{
        err ? console.log(err) : res.json(data)
    }
        )
})
//use model.findbyId() to serch in your db by id
router.get('/:id',(req,res)=>{
    Person.findById({_id:req.params.id},(err,data)=>{
        err ? console.log(err) :res.json(data)
    })
})
//perform classic updates by running find,edit,then save
router.put('/:id',async (req,res)=>{
 
    try{
      var foodToAdd = 'hamburger';
      const data=await Person.findById(req.params.id)
      data.favoriteFoods=[...data.favoriteFoods,foodToAdd]
      const result= await  data.save()
      res.status(200).json(result)
    }
    catch(err){
      res.status(400).json({error:err})
    }
  })
  //Find a person by Name and set the person's age to 20 Using model.findOneAndUpdate() :

router.put('/update/:name',(req,res)=> {

    var ageToSet = 20;
    Person.findOneAndUpdate({name:req.params.name},{$set: {"age":ageToSet}},{returnNewDocument : true}, function(err, doc){
    if(err){return console.log("Something wrong when updating record!");}
    res.json(doc);                  
          })
 
    })  
   
    router.delete('/:id',(req,res)=> {
      Person.findByIdAndRemove({_id:req.params.id},(err,data)=> { 
          err ?  console.log(err) : res.json(data)
      }) })  
       
  
    router.delete('/delname/:name',(req,res)=> {
    Person.remove({ name:req.params.name},(err,data)=> { 
      err ?  console.log(err) : res.send('all persons named maram were deleted')
    })   })
    //Chain Search Query Helpers to Narrow Search Results :
router.get('/',(req,res)=> {
    var foodToSearch = "pizza";
    Person.find({favoriteFoods:{$elemMatch:{$eq:foodToSearch }}})
    .sort({name : "desc"})
    .limit(2)
    .select("-age")
    .exec((err, data) => {
         if(err)
       return  console.log(err);
      res.json(data)
    })
    })
    module.exports=router