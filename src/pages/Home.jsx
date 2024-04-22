import axios from 'axios';
import qs from 'qs';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	setCategoryId,
	setCurrentPage,
	setFilters,
} from '../redux/slices/filterSlice';

import { SearchContext } from '../App';
import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Sort, { sortList } from '../components/Sort';

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const isSearch = React.useRef(false);
	const isMounted = React.useRef(false);

	const categoryId = useSelector(state => state.filter.categoryId);
	const sortType = useSelector(state => state.filter.sort.sortProperty);
	const currentPage = useSelector(state => state.filter.currentPage);

	const { searchValue } = React.useContext(SearchContext);

	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const onChangeCategory = id => {
		dispatch(setCategoryId(id));
	};

	const onChangePage = number => {
		dispatch(setCurrentPage(number));
	};

	const fetchPizzas = () => {
		setIsLoading(true);

		const order = sortType.includes('-') ? 'asc' : 'desc';
		const sortBy = sortType.replace('-', '');
		const category = categoryId > 0 ? `category=${categoryId}` : '';
		const search = searchValue ? `&search=${searchValue}` : '';

		axios
			.get(
				`https://660542d12ca9478ea17fdc67.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
			)
			.then(res => {
				setItems(res.data);
				setIsLoading(false);
			});
	};
	// Если изменили праметры и был первый рендер
	useEffect(() => {
		if (isMounted.current) {
			const queryString = qs.stringify({
				sortProperty: sort.sortProperty,
				categoryId,
				currentPage,
			});
			navigate(`?${queryString}`);
		}
		isMounted.current = true;
	}, [categoryId, sort.sortProperty, currentPage]);

	// Если был первый рендер, то проверяем URL-параметры и сохраняем в редаксе
	useEffect(() => {
		if (window.location.search) {
			const params = qs.parse(window.location.search.substring(1));

			const sort = sortList.find(
				obj => obj.sortProperty === params.sortProperty
			);

			dispatch(
				setFilters({
					...params,
					sort,
				})
			);
			isSearch.current = true;
		}
	}, []);

	// Если был первый рендер, то запрашиваем пиццы
	useEffect(() => {
		if (!isSearch.current) {
			fetchPizzas();
		}

		isSearch.current = false;

		window.scrollTo(0, 0);
	}, [categoryId, sort.sortProperty, searchValue, currentPage]);

	const pizzas = items.map(obj => <PizzaBlock key={obj.id} {...obj} />);
	const skeletons = [...new Array(6)].map((_, index) => (
		<Skeleton key={index} />
	));

	return (
		<div className='container'>
			<div className='content__top'>
				<Categories value={categoryId} onChangeCategory={onChangeCategory} />
				<Sort />
			</div>
			<h2 className='content__title'>Все пиццы</h2>
			<div className='content__items'>{isLoading ? skeletons : pizzas}</div>
			<Pagination currentPage={currentPage} onChangePage={onChangePage} />
		</div>
	);
};

export default Home;
