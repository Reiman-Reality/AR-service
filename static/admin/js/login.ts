async function makeRequest(){
    const  res = await fetch("http://coms-402-sd-37.class.las.iastate.edu:8080/admin/api/getModels");
     const login =await res.json();
}

