export class StructuredResponse{

    [key: string]: any; // Allows dynamic properties

    constructor(structure: {[key: string]: any}){
        Object.keys(structure).forEach(key => {
            this[key] = structure[key];
          });
    }

    public toJson(){
        return JSON.stringify(this)
    }
}