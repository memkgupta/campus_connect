"use client"
import React, { useEffect, useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
// import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
const ComboBox = ({options,stateSetter,label,defaultNull,defaultValue}:{options:{id:string,value:string,label:string}[],stateSetter:any,label:string,defaultNull?:boolean,defaultValue?:any}) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState<{ id:string,value: string; label: string; }|null>(options.find((o)=>o.value===defaultValue)||options[0])
    const [query,setQuery] = useState('');
const [filteredData, setFilteredData] = useState(() => {


  const result =
    query === ''
      ? options
      : options.filter((option) => {
          const match = option.label.toLowerCase().includes(query.toLowerCase());
        
          return match;
        });


  return result;
});
  
   useEffect(()=>{

stateSetter(value);
   },[value])
   useEffect(()=>{
setFilteredData(options);
 
   },[options])
  useEffect(() => {
 
  if (query === '') {
    setFilteredData(options);
  } else {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
   
    setFilteredData(filtered);
  }
}, [query, options]);
    return (
        <div className="  w-52 ">
            <p className="text-sm text-slate-700">{label}</p>
        <Combobox value={value} onChange={(value) => setValue(value)} onClose={() => setQuery('')}>
          <div className="relative">
            <ComboboxInput
              className={clsx(
                'w-full rounded-lg border-none bg-white/5 py-1.5 pr-8 pl-3 text-sm/6 text-white',
                'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
              )}
              displayValue={(option:any) => {return options.length>0?(option?.label):""}}
              onChange={(event) => setQuery(event.target.value)}
            />
            <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
              <ChevronDownIcon className="size-4 fill-white/60 group-data-[hover]:fill-white" />
            </ComboboxButton>
          </div>
  
          <ComboboxOptions
            anchor="bottom"
            transition
            className={clsx(
              'w-[var(--input-width)] rounded-xl border border-white/5 bg-slate-950 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
              'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
            )}
          >
            {filteredData.map((option) => (
              <ComboboxOption
                key={option.id}
                value={option}
                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-white/10"
              >
                <CheckIcon className="invisible size-4 fill-white group-data-[selected]:visible" />
                <div className="text-sm/6 text-white">{option.label}</div>
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </Combobox>
      </div>
    )
}

export default ComboBox