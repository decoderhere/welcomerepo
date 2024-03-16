const  hello = register => (req,res,next) => {

    const promise= new Promise ((resolve,reject)=>{
        resolve (register(req, res, next))
    })
    promise.catch(next) // ye daalne se ab wo error class m pohch jayega isse pehle ye kisi m nahi ja rah tha, uncaught tha
                       // pehle register function chalega agar promise resolve ho gaya to sahi h
                       // warna ye catch m jaake, err ban jayega jise ham error middleware se catch kar sakte h
}


module.exports= hello;