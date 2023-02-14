import bcrypt from 'bcrypt'

//BCRYPT PASSWORD USE THIS METHOD START
const secure = async (password) => {

    try {
      const passwordhash = await bcrypt.hash(password, 10)
      return passwordhash
  
    } catch (error) {
      res.status(400).send(error.message)
    }
  }

  export default secure

