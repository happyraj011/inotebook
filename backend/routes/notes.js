const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");
const { body, validation, validationResult } = require("express-validator");
//Route 1: get all the notes   using "/api/auth/fetchallnotes". login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch(error){
    console.error(error.message);
    res.status(500).send("internal server error occured");
  }
});



//Route 2:add a new note  using "/api/auth/fetchallnotes". login required
router.post(
  "/addnotes",
  fetchuser,
  [
    body("title", "Enter a vaild title").isLength({ min: 3 }),
    body("description", "description must be atlest 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const saveNote = await note.save();
      res.json(saveNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("internal server error occured");
    }
  }
);







//Route 3:update existing note  using "/api/auth/updatesnotes". login required
router.put("/updatenote/:id",fetchuser, async (req, res) => {
  const {title,description,tag}=req.body;
  const newNote={};
  if(title){newNote.title=title};
  if(description){newNote.description=description};
  if(tag){newNote.tag=tag};
  
  let note=await Note.findByIdAndUpdate(req.params.id)
  if(!note){return res.status(404).send("not found")}

  if(note.user.toString()!==req.user.id){
    return res.status(401).send("not allowed")
  }
  note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
  res.json({note});
   
})







//Route 3:delete  existing note  using "/api/auth/deletenotes". login required
router.delete("/deletenote/:id",fetchuser, async (req, res) => {
  const {title,description,tag}=req.body;
  try {
  let note=await Note.findByIdAndUpdate(req.params.id)
  if(!note){return res.status(404).send("not found")}

  if(note.user.toString()!==req.user.id){
    return res.status(401).send("not allowed")
  }
  note=await Note.findByIdAndDelete(req.params.id,{new:true})
  res.json({"success":"Note has been deleted",note:note});
   
}
 catch (error) {
  console.error(error.message);
  res.status(500).send("internal server error occured");
} })




module.exports = router;
