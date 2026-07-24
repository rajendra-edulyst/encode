/**  

@@@ Disclaimer: This code belongs to Edulust Ventures Private Limited 

@date of Version 1 : 21 March 2025
@author:: Edulyst Ventures  
@purpose : This Component is used to render the PDF file in the viewer as well as the watermark on the PDF
@dependency : This component is dependent on the initialPage props

@@ Use case (if any use case) and solutions 

**/

import React from 'react'
import appConfig from '@/configs/app.config'

interface CopyrightProps {
    scale?: number
}

const Copyright: React.FC<CopyrightProps> = ({ scale = 1 }) => {
    return (
        <div style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
            {
                appConfig?.content?.pdf?.watermark?.show && (
                    appConfig?.content?.pdf?.watermark?.items?.map((item, index) => (
                        <div key={'watermark-' + index}
                            style={{
                                ...item.style,
                                fontSize: item.style?.fontSize || `${7 * scale}rem`,
                            }}
                            dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                    ))
                )
            }
        </div>
    )
}

export default Copyright