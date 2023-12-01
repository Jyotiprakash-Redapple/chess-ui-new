import React, { useEffect, useState } from 'react';
import Player from '@/components/player/player';
import Opponent from '@/components/opponent/opponent';
function page() { 
    return (
        <main>
            <div className='view_container'>
                <div className='search_wrapper'>
                    <div className='search_banner_bg'>
                        <div className='inner_wrapper'>
                            <div className='match_macking'>
                                <div className='match_macking_bg'></div>
                                <div className='match_macking_logo'></div>
                            </div>
                            <div className='match_make_player'>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default page