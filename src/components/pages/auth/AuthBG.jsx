import React from "react"

const AuthBG = ({View})=>{
    if (View === 'landing') {
        return null; 
    }
    return(
        <>
        <div className="absolute top-[70%] bottom-[0px] left-1/2 -translate-x-1/2 w-full h-[500px] z-10 pointer-events-none">
          <img 
            src="/vortex1.png" 
            alt="Vortex Background" 
            className="w-full h-full object-contain mix-blend-screen opacity-50" 
          
          />
        </div>

        <div className="absolute top-[60%] bottom-[0px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] z-20 pointer-events-none">
          <img 
            src="/vortex1.png" 
            alt="Vortex Background" 
            className="w-full h-full object-contain mix-blend-screen opacity-70" 
          
          />
        </div>

        <div className="absolute top-[55%] bottom-[0px] left-1/2 -translate-x-1/2 w-[400px] h-[300px] z-30 pointer-events-none">
          <img 
            src="/vortex1.png" 
            alt="Vortex Background" 
            className="w-full h-full object-contain mix-blend-screen opacity-120" 
          
          />
        </div>

        <div className="absolute top-[40%] bottom-[0px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] z-0 pointer-events-none">
          <img 
            src="/Subtract.png" 
            alt="Subtract Background" 
            className="w-full h-full object-cover mix-blend-screen opacity-90 translate-y-[20px]" 
          
          />
        </div>
    
        </>
    )
}
export default AuthBG;