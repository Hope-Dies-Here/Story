

const express = require ("express")
const router = express.Router()
const Story = require ("../Models/story")

async function getStory(req, res, next){
  let tempStory
  try{
    tempStory = await Story.findById(req.params.id)
    if(tempStory == null) {
      return res.status(404).json({msg: "no story found"})
    }
  } catch (err){
      return res.status(500).json({msg: "somthn err"}) 
    }
    res.tempStory = tempStory
    next()
}

//routers
router.get("/", (req, res) => {
  res.render("home")
})

router.get("/home", (req, res) => {
  res.redirect("/")
})

//declaraton 
const stories = []
let alt = false

//routs
router.get("/fundamentals", (req, res) => {
  res.render("fundamentals")
})

router.get("/stories", async(req, res) => {
  try{
    const story = await Story.find().sort({$natural: -1})
    //res.json(story)
    res.render("stories", {
      stories: story,
      alt: alt
    })
    alt = false
  } catch(err) {
    res.status(500).json({msg: "lmao nope"})
    console.log(err)
  }
})

router.post('/postStory', async(req, res) => {
  const story = new Story({
    title: req.body.title,
    story: req.body.story
  }) 
  try{
    const newStory = await story.save()
    res.redirect("/stories")
  } catch(err){
    res.status(500).json({msg: "lmao nope"})
  }
})

router.post('/delete/:id', getStory, async(req, res) => {
  try{
  
  await res.tempStory.deleteOne()
  alt = true
  const story = await Story.find().sort({$natural: -1})
    res.redirect("/stories")
  } catch(err) {
    res.status(500).json({msg: "remove error"})
    console.log(err)
  }
})


router.get('/:id', getStory, async(req, res) => {
  try{
    res.render('editStory', {
      title: res.tempStory.title,
      story: res.tempStory.story,
      id: res.tempStory.id
    })
  } catch(err){
    res.send(err)
  }
})

router.post('/updateStory/:id', getStory, async(req, res) => {
  if(req.body.title != null){
    res.tempStory.title = req.body.title
  }
  if(req.body.story != null){
    res.tempStory.story = req.body.story
  }
  try{
    await res.tempStory.save()
    res.redirect('/stories')
  } catch(err){
    console.log(err)
  }
})
module.exports = router

