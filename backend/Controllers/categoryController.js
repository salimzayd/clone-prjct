import Category from "../models/categorySchema.js";


export const createCategory = async(req,res) =>{
    const {category} = req.body;

    try{

        const newCategory = new Category({category});
        await newCategory.save();
        res.status(201).json(newCategory)

    }catch(error){
        console.error(error);
    }
};


export const getCategories = async (req,res) =>{

    try{

        const categories = await Category.find();
        res.status(200).json(categories);
    }catch(error){
        console.error(error);
    }
}


export const updateCategory = async (req,res) =>{
const {id} = req.params;
const {category} = req.body

try{
    const updatedCategory = await Category.findByIdAndUpdate(id,{category},{new:true,runValidators:true});

    if(updatedCategory){
        res.status(200).json(updatedCategory)
    }else{
        return res.status(404).json({
            status:"error",
            message:"category is not found"
        })
    }

}catch(err){
    console.error(err);
}
}

export const deleteCategory = async (req,res) =>{
    const {id} = req.params

    try{
        const deletedCategory = await Category.findByIdAndDelete(id);
        if(deletedCategory){
            res.status(200).json({
                status:'success',
                message:"category deleted successfully"
            })
        }else{
            res.status(404).json({
                status:"error",
                message:"category not found"
            })
        }
    }catch(error){
        console.error(error);
    }
}