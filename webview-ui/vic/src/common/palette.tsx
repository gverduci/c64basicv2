import React, { FC, ReactElement } from "react";

const colors = [
    {name:"Black", value:0, webColor:"#000000"},
    {name:"White", value:1, webColor:"#FFFFFF"},
    {name:"Red", value:2, webColor:"#880000"},
    {name:"Cyan", value:3, webColor:"#AAFFEE"},
    {name:"Violet", value:4, webColor:"#CC44CC"},
    {name:"Green", value:5, webColor:"#00CC55"},
    {name:"Blue", value:6, webColor:"#0000AA"},
    {name:"Yellow", value:7, webColor:"#EEEE77"},
    {name:"Orange", value:8, webColor:"#DD8855"},
    {name:"Brown", value:9, webColor:"#664400"},
    {name:"Lightred", value:10, webColor:"#FF7777"},
    {name:"Darkgrey", value:11, webColor:"#333333"},
    {name:"Grey", value:12, webColor:"#777777"},
    {name:"Lightgreen", value:13, webColor:"#AAFF66"},
    {name:"Lightblue", value:14, webColor:"#0088FF"},
    {name:"Lightgrey", value:15, webColor:"#BBBBBB"}
];

export interface IPaletteParams {
    selectCallback: (color:number)=>void;
  }

const Palette: FC<IPaletteParams> = ({selectCallback}): ReactElement | null => {
    return (
        <div>
        {colors.map(c=>{
            return (<span slot="start" className="codicon codicon-circle-large-filled" style={{color: c.webColor}} onClick={() =>
                selectCallback(c.value)
              }></span>)
        })}
        </div>
    );
};

export default Palette;