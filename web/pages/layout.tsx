import { Grid, GridItem } from '@chakra-ui/react';
import { Link, Outlet } from 'react-router-dom';
import { BaseComponent } from '../components/base-component';
export class Layout extends BaseComponent {


    draw(){
        // console.log("AAAAAAAAA", this.context)
        return (
            <Grid
                templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
                gridTemplateRows={'50px 1fr 30px'}
                gridTemplateColumns={'150px 1fr'}
                h='90vh'
                w='60vw'
                gap='1'
                color='blackAlpha.700'
                fontWeight='bold'
            >
                <GridItem pl='2' bg='gray.300' area={'header'}>
                    Header
                    <li><Link to="/">Home</Link></li>
                        <li><Link to="/resources">Resources</Link></li>
                        <li><Link to="/admin/departments">Departments</Link></li>
                        <li><Link to="/admin/users">Users</Link></li>
                </GridItem>
                <GridItem pl='2' bg='gray.300' area={'nav'}>
                    Nav
                </GridItem>
                <GridItem pl='2' bg='gray.300' area={'main'}>
                    <Outlet />
                </GridItem>
                <GridItem pl='2' bg='gray.300' area={'footer'}>
                    Footer
                </GridItem>
            </Grid>
        )
    }    
}