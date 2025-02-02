import { useEffect, useRef, useState } from "react";

import { City } from "./App";
import { IconAdd } from "./lib/icons";
import { getCityKey } from "./lib/storage";
import { loadTimezones } from "./lib/timezones";
import { toLatinString } from "./lib/utils";

export const AddCityButton = ({
    openModal,
    hasCity,
    addCity,
    closeModal,
}: {
    openModal: (content: React.ReactNode) => void;
    hasCity: (city: City) => boolean;
    addCity: (city: City) => void;
    closeModal: () => void;
}) =>
{
    function openMenu(): void {
        openModal(<AddCityMenu hasCity={hasCity} addCity={addCity} closeModal={closeModal} />);
    }

    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            if (event.key === "+") {
                event.preventDefault();
                openMenu();
            } else if (event.key === "Escape") {
                closeModal();
            }
        }
        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [openModal, hasCity, addCity, closeModal]);

    return (
        <div id="add-city-btn" className="big-btn" onClick={openMenu}>
            <IconAdd />
        </div>
    );
};

type UICity = City & {
    selected: boolean;
};
const timezones = loadTimezones();

export const AddCityMenu = ({
    hasCity,
    addCity,
    closeModal,
}: {
    hasCity: (city: City) => boolean;
    addCity: (city: City) => void;
    closeModal: () => void;
}) => {
    const [searchText, setSearchText] = useState("");
    const [foundCities, setFoundCities] = useState<UICity[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // On search input change, update `foundCities`
    useEffect(() => {
        if (searchText.length <= 2) {
            setFoundCities([]);
            return;
        }
        const searchLatin = toLatinString(searchText);
        const newFoundCities: UICity[] = [];
        for (const tz of timezones) {
            const citiesCount = tz.citiesLatin.length;
            for (let i = 0; i < citiesCount; i++) {
                const cityLatin = tz.citiesLatin[i];
                if (!cityLatin.startsWith(searchLatin)) {
                    continue;
                }
                const city: UICity = {
                    name: tz.cities[i], // the actual city name with special characters
                    country: tz.countryCode,
                    tz: tz.name,
                    key: getCityKey(tz.cities[i], tz.countryCode),
                    selected: false,
                };
                city.selected = hasCity(city);
                newFoundCities.push(city);
            }
        }
        setFoundCities(newFoundCities);
    }, [searchText]);

    // On ArrowUp/ArrowDown/Enter, navigate and select cities
    useEffect(() => {
        function handleKeyPress(event: KeyboardEvent) {
            switch (event.key) {
                case "ArrowUp":
                    if (activeIndex !== null && activeIndex > 0) {
                        setActiveIndex(activeIndex - 1);
                    }
                    break;
                case "ArrowDown":
                    if (activeIndex === null) {
                        setActiveIndex(0);
                    } else if (activeIndex < foundCities.length - 1) {
                        setActiveIndex(activeIndex + 1);
                    }
                    break;
                case "Enter":
                    if (activeIndex !== null) {
                        const selectedCity = foundCities[activeIndex];
                        selectCity(selectedCity);
                    }
                    break;
                default:
                    break;
            }
        }

        document.addEventListener("keydown", handleKeyPress);
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [activeIndex, foundCities]);

    function selectCity(city: UICity): void {
        if (!city.selected) {
            city.selected = true;
            addCity(city);
            setFoundCities([...foundCities]);
        }
    }

    const inputRef = useRef<HTMLInputElement>(null);
    const hasResults = foundCities.length > 0;
    return (
        <div id="add-city-menu">
            <h2>Add City</h2>
            <input
                id="add-city-input"
                ref={inputRef}
                className={hasResults ? "has-results" : ""}
                type="text"
                value={searchText}
                autoFocus
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search for a city..."
                spellCheck="false" autoCorrect="off" autoComplete="off"
            />
            {
                hasResults
                ?
                <div id="add-city-results" >
                    {foundCities.map((city, index) => (
                        <div
                            className={`city-result ${city.selected ? "selected" : ""} ${index === activeIndex ? "active" : ""}`}
                            onClick={() => selectCity(city)}
                            key={index}
                        >
                            <span>{city.name} ({city.country.toUpperCase()})</span>
                            {city.selected && <span className="city-checkmark">✓</span>}
                        </div>
                    ))}
                </div>
                :
                (
                    searchText.length <= 2
                    ? null
                    : <div id="add-city-no-results">No results. Try searching for a big city nearby.</div>
                )
            }
        </div>
    );
};
