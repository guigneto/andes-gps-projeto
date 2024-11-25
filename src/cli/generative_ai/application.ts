import axios from 'axios'
import * as dotenv from 'dotenv';
import { EnvLoader } from '../util/envLoader.js';
export  class OpenAI {

  constructor (){
    dotenv.config() 
  }
  
   public async send (prompt: string, target_folder:string ){

        new EnvLoader(target_folder);
    
        const apiKey = EnvLoader.getEnvVariable('OPENIA_KEY') ?? "" 
       
        
        const apiUrl = 'https://api.openai.com/v1/chat/completions';

        try {
            const response = await axios.post(apiUrl, {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
              });
        
            // Handle the response
            if (response.status === 200) {
              return response.data.choices[0].message.content;;
            } else {
              console.log(response.statusText)
              throw new Error (response.statusText);
            }
          } catch (error) {
            console.log(error)
          }
   } 
    
  
}
