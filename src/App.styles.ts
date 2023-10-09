import styled from 'styled-components';
import IconButton from '@mui/material/IconButton';


export const Wrapper = styled.div`
  margin: 40px;
`;

export const StyledButton = styled(IconButton)`
  position: fixed;
  z-index: 100;
  right: 20px;
  top: 20px;
`;
export const FilterContainer = styled.div`
  display: flex;
  align-items: center; 
  gap: 10px;
  margin-top: 20px;
  padding-bottom: 40px;
`;

export const FilterInputs = styled.div`
  display: flex;
  gap: 10px;
  height: 40px;
  padding-bottom:10px;
  input {
    
    width: 150px;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
    height:45px;
  }
`;

export const FilterDropdowns = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 100%;

  .MuiFormControl-root {
    width: 150px;
  }



 
`;

export const SortDropdown = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;

  .MuiFormControl-root {
    width: 150px;
  }


`;
