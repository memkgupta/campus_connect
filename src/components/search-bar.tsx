import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { useToast } from "./ui/use-toast"
import { Loader2, Search } from "lucide-react"
import SearchResult from "./search-results"
import { BACKEND_URL } from "@/constants"
import { Input } from "./ui/input" // import your shadcn Input

const SearchBar = () => {
  const [query, setQuery] = useState("")
  const debounced = useDebounceCallback(setQuery, 500)
  const [searchResult, setSearchResult] = useState<
    { _id: string; label: string; url: string; thumbnail?: string; sub?: string }[]
  >([])
  const { toast } = useToast()
  const [isSearching, setIsSearching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setIsSearching(value.length > 0)
    debounced(value)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (query.length > 0) {
          const res = await axios.get(`${BACKEND_URL}/search`, {
            params: { q: query },
          })
          setSearchResult(res.data.results)
        } else {
          setSearchResult([])
        }
      } catch (error) {
        toast({
          title: "Some error occurred",
          variant: "destructive",
        })
      } finally {
        setIsSearching(false)
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="relative  items-center flex-1 max-w-md mx-6" ref={wrapperRef}>
      {/* Search Input */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search courses, events, announcements..."
          onFocus={() => setIsFocused(true)}
          onChange={handleInputChange}
          className="pl-10 pr-4 h-10 bg-muted/50 border-border/50 text-white placeholder:text-muted-foreground focus:bg-background focus:ring-1 focus:ring-yellow-400 transition-colors"
        />
      </div>

      {/* Dropdown Results */}
      {isFocused && (
        <div className="absolute top-12 left-0 w-full z-50 bg-background border border-slate-800 rounded-md shadow-xl animate-fadeIn max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
            </div>
          ) : searchResult.length === 0 ? (
            <div className="px-4 py-3 text-sm text-center text-muted-foreground">
              No results found
            </div>
          ) : (
            <div className="p-2 flex flex-col gap-1">
              {searchResult.map((res) => (
                <SearchResult
                  key={res._id}
                  href={res.url}
                  label={res.label}
                  sub={res.sub}
                  thumbnail={res.thumbnail}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar
