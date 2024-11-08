import axios from 'axios'

export  class OpenAI {
  
   public async send (prompt: string ){
        const apiKey = 'sk-proj-Px3enTtsC2WpnKJwNw42T3BlbkFJPN0gHPSVGQp5NnY5YLyo'

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
