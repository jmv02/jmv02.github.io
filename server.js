import express from "express"; 
import mysql2 from "mysql2";
import jwt from "jsonwebtoken"; 
import cors from "cors"; 
import dotenv from "dotenv";
import fs from "fs"; 


const donenv = dotenv.config();

export const mysqlConnection = mysql2.createConnection({
  host:'localhost',
  user:'root',
  password:'MYSQLnebrija2024_',
  database:'VentaVehiculos_db',
});

mysqlConnection.connect(e=> {
  if(e){
      console.error("Error conectando con la base de datos",e); 
      return; 
  }else{
      console.log("Conectado con la base de datos");

  }
});

const RSA_KEY = process.env.RSA_KEY;
const pub_RSA_KEY = process.env.pub_RSA_KEY;
const app = express();
app.use(express.json());
app.use(cors()); 
//ENDPOINTS 
//ENDPOINTS LOGIN Y REGISTER
app.post('/register', async (req ,res) => {
  const {username,email, password} = req.body; 
  try{
      mysqlConnection.query(`insert into users (email,username,password) values ("${email}","${username}","${password}")`,
         (error,results)=>{
        res.status(200).json("Usuario registrado correctamente");
      });
    }catch(e){
      res.status(500).json("Error insertando usuario");
      console.error(e);
    }
});
app.post('/login', async (req,res) =>{
  const { email, password } = req.body;
  try{
  if(!email || !password){
      return res.status(400).json("Introduce tus datos primero para iniciar sesion");
  }
  mysqlConnection.query('SELECT * FROM users WHERE email = ?', [email],async(err, results) => {
      if (results.length === 0) {
        return res.status(404).json("Usuario no registrado");
      }
      const user = results[0];
      if (user.password !== password) {
        return res.status(400).json("Contraseña incorrecta");
      }
  const token = jwt.sign({user_id:user.user_id,email:user.email},RSA_KEY, { algorithm: 'RS256',expiresIn:"1h" }); 

  res.json({token}); 
  console.log(token);

}); 
}catch(e){
  console.error(e); 
}
});



export function decodeToken(req, res,next) {
  const token = req.headers['authorization']; 
  console.log("Decoding:",token);
  if (!token) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }

  const decodeToken = jwt.verify(token,pub_RSA_KEY); 
  req.user_id = decodeToken.user_id;
  console.log(req.user_id);
  next();
  }



//ENDPOINTS ANUNCIOS 

app.post('/create/ad',decodeToken, async (req,res)=>{
  const { brand,model,price,kilometros, description } = req.body; 
  const user_id = req.user_id;
  try{
    if(!user_id || !brand || !model || !price || !kilometros || !description){
      return res.status(400).json("Error, faltan datos")
    }
     mysqlConnection.query(`insert into vehicles (user_id,
      brand,model,price,kilometros,description) values ("${user_id}","${brand}","${model}","${price}","${kilometros}","${description}")`,(result)=>{  
        res.status(200).json("Anuncio creado correctamente");  
      });
  }catch(e){
    console.error(e);
    res.status(500).json("Error creando anuncio. Vuelve a intentarlo"); 
  }
});
app.delete('/delete/ad/:id', async(req,res)=>{
  const {id} = req.params.id;
  try{
    if(!id){
      return res.status(404).send("Anuncio no encontrado"); 
    }
    mysqlConnection.query(`DELETE FROM VEHICLES WHERE VEHICLE_ID = ${id}`,(error,result)=>{
      res.status(200).json("Anuncio borrado correctamente");
    }); 
  }catch(e){
    console.error(e); 
    res.status(500).json("Error borrando anuncio");
  }
});
app.get('/ads', async(req,res) => {
  try{
    mysqlConnection.query('SELECT * FROM vehicles',(error,results)=>{
      if(error){
        res.status(500).json("No se pueden obtener los anuncios");
      }

      res.status(200).json(results);
    })
  }catch(e){
    console.error(e);
  }});


  
app.listen(3000, () => {
  console.info(`Server started on port 3000`);
});
