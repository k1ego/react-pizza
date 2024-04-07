import React from 'react';
import debounce from 'lodash.debounce'
import { SearchContext } from '../../App';

import styles from './Search.module.scss';

export const Search = () => {
	const [value, setValue] = React.useState('');
	const { setSearchValue } = React.useContext(SearchContext);
	const inputRef = React.useRef();

	const onClickClear = () => {
		setSearchValue('');
		setValue('');
		inputRef.current.focus();
	};

	const updateSearchValue = React.useCallback(
		debounce(str => {
			setSearchValue(str);
		}, 1000),
		[],
	)

	const onChangeInput = (event) => {
		setValue(event.target.value);
		updateSearchValue(event.target.value);
	}

	return (
		<div className={styles.root}>
			<svg
				className={styles.icon}
				height='48'
				viewBox='0 0 48 48'
				width='48'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path d='M31 28h-1.59l-.55-.55c1.96-2.27 3.14-5.22 3.14-8.45 0-7.18-5.82-13-13-13s-13 5.82-13 13 5.82 13 13 13c3.23 0 6.18-1.18 8.45-3.13l.55.55v1.58l10 9.98 2.98-2.98-9.98-10zm-12 0c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z' />
				<path d='M0 0h48v48h-48z' fill='none' />
			</svg>
			<input
				ref={inputRef}
				value={value}
				onChange={onChangeInput}
				className={styles.input}
				placeholder='Поиск пиццы...'
			/>
			{value && (
				<svg
					onClick={onClickClear}
					className={styles.clearIcon}
					fill='none'
					height='24'
					viewBox='0 0 24 24'
					width='24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path
						d='M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z'
						fill='currentColor'
					/>
				</svg>
			)}
		</div>
	);
};

export default Search;
