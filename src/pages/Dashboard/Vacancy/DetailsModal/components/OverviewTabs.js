import React from 'react'

function OverviewTabs({children,classObj}) {
  return (
   <>
   <div className={`${classObj} h-max-[20vh] w-[100%] border border-black rounded-lg flex flex-col items-start p-2`}>
{children}
   </div>
   </>
  )
}

export default OverviewTabs
