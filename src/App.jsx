import { useEffect, useState } from 'react';
import { Nav, SearchBar } from '../src/app/components';
import { getCharacterById, getRandomCharId, login, register, AppRoutes, isCharacterDuplicate, getCharacterByPage } from '../src/app/services';
import styles from "./App.module.css";
import { useLocationPathname, useCharactersState, useAccessState, useNavigateFunction, useTotalChar, useUser, useCharsByPage } from '../src/app/hooks';
import { handleErrors } from '../src/app/helpers';


export const App = () => {

    const [pageCharacters, setPageCharacters] = useCharsByPage();
    const [currentPage, setCurrentPage] = useState(1);

    const totalChar = useTotalChar();
    const pathname = useLocationPathname();
    const [characters, setCharacters] = useCharactersState();


    const [access, setAccess] = useAccessState();
    const [user, setUser] = useUser();
    const navigate = useNavigateFunction();

    const handleLogin = async (userData) => {
        try {
            await login(userData, setAccess, setUser, navigate);
        } catch (error) {
            handleErrors(error);
        }
    }

    const handleRegister = async (userData) => {
        try {
            await register(userData, setAccess, setUser, navigate);
        } catch (error) {
            handleErrors(error);
        }
    }

    useEffect(() => {
        if (access && user && pathname !== '/') {
            navigate('/app/home')
        }

    }, [access]);

    useEffect(() => {
        const fetchCharacters = async () => {
            try {
                // const page = 1;
                const charactersData = await getCharacterByPage(currentPage);
                setPageCharacters(charactersData);
            } catch (error) {
                handleErrors(error);
            }
        };

        fetchCharacters();
    }, [currentPage]);

    const onSearch = async (id) => {
        try {
            const data = await getCharacterById(id);
            if (data.name) {
                setPageCharacters([]);
                const isDuplicate = isCharacterDuplicate(characters, data.id);
                !isDuplicate
                    ? setCharacters(oldChars => [...oldChars, data])
                    : window.alert('¡El personaje ya está en la lista!');
            } else {
                window.alert('¡No hay personajes con este ID!');
            }

        } catch (error) {
            handleErrors(error);
        }
    }

    const onClose = (id) => {
        setCharacters(
            characters.filter((char) => {
                return char.id !== id;
            })
        )
    }

    const getRandomChar = async () => {
        try {
            setPageCharacters([]);
            const randomCharId = getRandomCharId(totalChar);
            const randomCharData = await getCharacterById(randomCharId);
            randomCharData
                ? setCharacters(oldChars => [...oldChars, randomCharData])
                : window.alert('No hay personajes con este ID!');
        } catch (error) {
            handleErrors(error);
        }
    };

    let navComponent = null;
    let searchBarComponent = null;
    if (pathname !== '/app' && pathname !== '/' && pathname !== '/app/register') {
        navComponent = <Nav onSearch={onSearch} getRandomChar={getRandomChar} user={user} />;
    }

    if (pathname === '/app/home') {
        searchBarComponent = <SearchBar onSearch={onSearch} />
    }

    const goToPage = page => {
        setCurrentPage(page);
    };

    const goToNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    }

    return (
        <div className={styles.appContainer}>
            {navComponent}
            {searchBarComponent}
            <AppRoutes characters={characters.concat(pageCharacters)} onClose={onClose} handleLogin={handleLogin} handleRegister={handleRegister} />
            <div className={styles.btnContainer}>
                <button
                    className={styles.btnPagination}
                    onClick={() => goToPreviousPage()} disabled={currentPage === 1}>Prev</button>

                {[1, 2].map(page => (
                    <button className={styles.btnPagination} key={page} onClick={() => goToPage(page)}>
                        {page}
                    </button>
                ))}

                <button
                    className={`${styles.btnPagination} ${styles.disabledBtn}`}
                    disabled>...</button>

                {[41, 42].map(page => (
                    <button
                        className={styles.btnPagination}
                        key={page}
                        onClick={() => goToPage(page)}>
                        {page}
                    </button>
                ))}

                <button
                    className={styles.btnPagination}
                    onClick={() => goToNextPage()} disabled={currentPage === 42}>Next</button>
            </div>
        </div>
    );
}