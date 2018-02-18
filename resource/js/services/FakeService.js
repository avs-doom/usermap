'use strict';


export default class FakeService  {
    
    static getFeatures() {
        
        return new Promise((resolve, reject) => {
            fetch('http://localhost:3000/features')
            .then(response => {
                 return response.json()
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        });
    }
}