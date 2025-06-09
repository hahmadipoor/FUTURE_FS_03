// src/lib/api.js

const API_URL = 'http://localhost:1337/api'; // replace with your Strapi base URL

export async function getCourses() {
    console.log("aaaaaaaaaaaaa");
    
  //const res = await fetch(`${API_URL}/courses?populate=instructor,image`);
    const res = await fetch(`http://localhost:1337/api/courses?populate=*`);
  console.log(res);
  
  if (!res.ok) {
    throw new Error('Failed to fetch courses');
  }
  const data = await res.json();
  return data.data;
}
