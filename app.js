const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 3000
const _ = require("lodash")
// console.log(date())

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.set('view engine', 'ejs')

mongoose.connect("mongodb+srv://admin-ayush:ayush1234@cluster0.bfeyxvx.mongodb.net/todolistDB", { useNewUrlParser: true });

//Schema
const itemsSchema = {
    name: String
};

//Model based on Schema
const Item = mongoose.model("Item", itemsSchema)

const Tea = new Item({
    name: "Tea"
})
const Coffee = new Item({
    name: "Coffee"
})
const Clothes = new Item({
    name: "Clothes"
})

const defaultItems = [Tea, Coffee, Clothes];

//List Schema
const listSchema = {
    name: String,
    items: [itemsSchema]
}
//List Model
const List = mongoose.model("List", listSchema)



// Item.insertMany(defaultItems, function(err){
//     if(err){
//         console.log(err)
//     }
//     else{
//         console.log("Success")
//     }
// })

app.get("/", (req, res) => {
    Item.find({}, function (err, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Success")
                }
            })
            res.redirect("/")
        }
        else{
            res.render("list", { listTitle: "Today", itemName: foundItems })
        }
    })
})


app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                //Create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            }else{
                //Show an existing list
                res.render("list", { listTitle: foundList.name, itemName: foundList.items })
            }
        }
    })
})


app.post("/", (req, res) => {

    const newItemName = req.body.anyThing;
    const listName = req.body.list;

    const item = new Item({
        name: newItemName
    })

    if(listName === "Today"){    
        item.save()
        res.redirect("/")
    }else{
        List.findOne({name: listName}, function(err, foundList){
            foundList.items.push(item)
            foundList.save()
            res.redirect("/" + listName)
        })
    }
})


app.post("/delete", function(req, res){
    const checkedId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedId, function(err){
            if(err){
                console.log(err)
            }
            else{
                console.log("Succesffully deleted the item")
                res.redirect("/")
            }
        })
    }
    else{
        List.findOneAndUpdate({name: listName}, {$pull:{items: {_id: checkedId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            }
        })
    }


})


app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work", itemName: workItems })
})
app.post("/work", (req, res) => {
    let item = req.body.anyThing;
    workItems.push(item);
    res.redirect("/work");
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.listen(PORT, (req, res) => {
    console.log("The Server has started on PORT: " + PORT)
})