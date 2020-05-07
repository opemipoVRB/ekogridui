export const updateObject  =(OldObject, updateProperties) =>{
    return{
        ...OldObject,
        ...updateProperties
    }
};