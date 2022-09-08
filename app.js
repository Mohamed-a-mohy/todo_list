const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const date = require(__dirname+"/date.js")

const app = express()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


mongoose.connect('mongodb://localhost:27017/todolistDB');
const itemsSchemla = {name: String}
const Item = mongoose.model('Item', itemsSchemla);

const listSchema = {
    name: String,
    items: [itemsSchemla],
}
const List = mongoose.model("List", listSchema);

const item1 = new Item({ name: 'u can make new list by typing in url after the "/" ' });
const item2 = new Item({ name: 'add new item by clicking "+" button' });
const item3 = new Item({ name: '<<-- to delete item from list' });


const defultItems = [item1,item2 , item3]

var items = []
var workList = []







day = date.getDay()

app.get("/", function (req, res) {

    Item.find({},function(err,result){
        if(err){
            console.log(err)
        }else{
            if(result.length < 1){
                Item.insertMany(defultItems,function(err){
                    if(err){
                        console.log(err)
                    }else{
                        console.log("successfully items add")
                    }
                })
                res.redirect("/")
            }else{
                
                items = result
                res.render("list", { title: "Today", htmlItems: items })
            }

        }
    })
})




app.get("/:custom", function (req, res) {
    const customList = req.params.custom

    List.findOne({name: customList} , function(err,foundList){
        if(!err){
            if(!foundList){
                //create new list
                const list = new List({
                    name:customList,
                    items:defultItems
                })
                list.save()
                res.redirect("/"+customList)
            }else{
                //display exiting list
                res.render("list", { title: foundList.name, htmlItems: foundList.items })
            }
        }
    })
})

app.get("/about", function (req, res) {

    res.render("about")
})

app.post("/", (req, res) => {
    console.log(req.body)

    const itemName = req.body.newItem
    const listName = req.body.list
    const item = new Item({ name: itemName });

    if(listName === "Today" || listName === "today"){
        item.save()
        res.redirect("/")
    }else{
        List.findOne({name: listName},function(err,foundList){
            foundList.items.push(item)
            foundList.save()
            res.redirect("/"+listName)
        })
    }


})


app.post("/delete" , function(req,res){
    const checkedItem = req.body.checkbox
    const listName = req.body.listName

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItem,function(err){
            if(err){
                console.log(err)
    
            }else{
                console.log("deleted")
                
            }
        })
        res.redirect("/")
    }else{

        List.findOneAndUpdate(
            {name: listName },
            {$pull: {items:{_id:checkedItem}}},
            function(err,foundList){
                if(!err){
                    console.log(err,foundList)
                    res.redirect("/"+listName)
                }
            }
        )
    }

})


app.listen(3000, function () {
    console.log("server on local host 3000")
})
