import { useState } from 'react';
import { useQuery } from 'react-query';
import Item from './Item/Item';
import Cart from './Cart/Cart';
import Drawer from '@mui/material/Drawer';
import LinearProgress from '@mui/material/LinearProgress';
import Grid from '@mui/material/Grid';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Badge from '@mui/material/Badge';
import {
  Wrapper,
  StyledButton,
  FilterContainer,
  FilterInputs,
  FilterDropdowns,
  SortDropdown,
} from './App.styles';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';

export type CartItemType = {
  id: number;
  category: string;
  description: string;
  image: string;
  price: number;
  title: string;
  amount: number;
};

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch('https://fakestoreapi.com/products')).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([] as CartItemType[]);
  const [searchedName, setSearchedName] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('price-low-to-high'); 

  const { data, isLoading, error } = useQuery<CartItemType[]>(
    'products',
    getProducts
  );

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.amount, 0);

  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems(prev => {
 
      const isItemInCart = prev.find(item => item.id === clickedItem.id);

      if (isItemInCart) {
        return prev.map(item =>
          item.id === clickedItem.id
            ? { ...item, amount: item.amount + 1 }
            : item
        );
      }

      return [...prev, { ...clickedItem, amount: 1 }];
    });
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prev =>
      prev.reduce((ack, item) => {
        if (item.id === id) {
          if (item.amount === 1) return ack;
          return [...ack, { ...item, amount: item.amount - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[])
    );
  };

  const handleFilterChange = () => {
    // Filter the data based on the search name and price range
    const filteredDataByName = data?.filter((item) =>
      item.title.toLowerCase().includes(searchedName.toLowerCase())
    );

    const filteredDataByPrice = data?.filter(
      (item) => item.price >= minPrice && item.price <= maxPrice
    );

    // Combine filters 
    const filteredData =
      filteredDataByName && filteredDataByPrice
        ? filteredDataByName.filter((item) =>
          filteredDataByPrice.includes(item)
        )
        : data;

    return filteredData;
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  const filteredData = handleFilterChange();

  // Sorting function
  const sortedData = [...(filteredData || [])].sort((a, b) => {
    if (sortOption === 'price-low-to-high') {
      return a.price - b.price;
    } else if (sortOption === 'price-high-to-low') {
      return b.price - a.price;
    } else {
      return 0; 
    }
  });


  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
    <Wrapper>
  <Drawer anchor='right' open={cartOpen} onClose={() => setCartOpen(false)}>
    <Cart
      cartItems={cartItems}
      addToCart={handleAddToCart}
      removeFromCart={handleRemoveFromCart}
    />
  </Drawer>
  <StyledButton onClick={() => setCartOpen(true)}>
    <Badge badgeContent={getTotalItems(cartItems)} color='error'>
      <AddShoppingCartIcon />
    </Badge>
  </StyledButton>
  <FilterContainer>
    <FilterInputs>
      <TextField
        type='text'
        placeholder='Search by name'
        value={searchedName}
        onChange={(e) => setSearchedName(e.target.value)}
      />
  
      
    </FilterInputs>
    <FilterDropdowns>
      <FormControl>
        <InputLabel>Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value as string)}
        >
          <MenuItem value=''>All</MenuItem>
          <MenuItem value='electronics'>Electronics</MenuItem>
          <MenuItem value='jewelry'>Jewelry</MenuItem>
      
        </Select>
      </FormControl>

      <SortDropdown>
        <FormControl>
          <InputLabel>Sort</InputLabel>
          <Select
            value={sortOption}
            onChange={(e) => handleSortChange(e.target.value as string)}
          >
            <MenuItem value='price-low-to-high'>Price: Low to High</MenuItem>
            <MenuItem value='price-high-to-low'>Price: High to Low</MenuItem>
          </Select>
        </FormControl>
      </SortDropdown>
    </FilterDropdowns>
  </FilterContainer>
  <Grid container spacing={3}>
    {sortedData
      ?.filter((item) => selectedCategory === '' || item.category === selectedCategory)
      .map((item) => (
        <Grid item key={item.id} xs={12} sm={4}>
          <Item item={item} handleAddToCart={handleAddToCart} />
        </Grid>
      ))}
  </Grid>
</Wrapper>

  );
};

export default App;
