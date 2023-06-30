//this is modified module 6 code, repurposed for use in this assignment.
//I'll cite it even if modified, just to be safe.
//<Lijuan Cao> (unknown) <storyController.js> (<1.0.0>) [Javascript]

const model = require('../models/connection');
const RSVP = require('../models/RSVP');

exports.indexPage = (req, res, next)=>{
    model.find()
    .then(connections=>res.render('./connections/index', {connections}))
    .catch(err=>next(err));
}

exports.newPost = (req,res)=>{
    res.render('./connections/new');
}

exports.createPost = (req,res, next)=>{
    let connection = new model(req.body);//create a new connection document
    connection.author = req.session.user;
    connection.save()//insert the document to the database
    .then(connection=> {
        req.flash('success', 'Connection has been created successfully');
        res.redirect('/connections');
    })
    
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
        req.flash('error', err.message);
        return res.redirect('back');
        }
        next(err);
    });
    
};


exports.editPost = (req, res, next)=>{
    let id = req.params.id;
    model.findById(id)
    .then(connection=>{
        return res.render('./connections/edit', {connection});
    })
    .catch(err=>next(err));
};

exports.updatePost = (req, res, next)=>{
    let connection = req.body;
    let id = req.params.id;
 

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        return res.redirect('/connections/'+id);
    })
    .catch(err=> {
        if(err.name === 'ValidationError') {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        next(err);
    });
};

exports.deletePost = (req, res, next)=>{
    let id = req.params.id;
    
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(connection =>{
        res.redirect('/connections');
    })
    .catch(err=>next(err));
   
};

exports.createRSVP = (req,res, next)=>{
    let id = req.params.id;
    RSVP.findOne({connection: id, user: req.session.user})
    .then(result=>{
        if(!result){
        let rsvp = new RSVP(req.body); //create a new document
        rsvp.connection = id;
        rsvp.user = req.session.user;
        rsvp.state = req.body.status;
        rsvp.save()
        .then(result=> {
            req.flash('success','RSVP successfully created!');
            res.redirect('/connections'
            )})
        .catch(err=>next(err));
        } else {
            RSVP.findOneAndUpdate({connection:id, state: req.body.status})
            .then(result=>{
                req.flash('success','RSVP successfully updated!');
                res.redirect('/connections')
            })
            .catch(err=>next(err));
        }
    })
    .catch(err=>next(err));
}

exports.show = (req, res, next) => {
    let id = req.params.id;

    model.findById(id).populate('author', 'firstName lastName')
    .then(connection=>{
        RSVP.find({name: id, state: 'YES'})
        .then(RSVP =>{
            if(connection){
               
                return res.render("./connections/show", {connection, RSVP});
            } else {
                let err = new Error("Cannot find connections with id " + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err=>next(err));

    })

    .catch(err=>next(err));
    };