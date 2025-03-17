import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ScanScreen from "../screens/ScanScreen";
import AddScreen from "../screens/AddScreen";
import ProfileScreen from "../screens/ProfileScreen";
import Icon from "react-native-vector-icons/Ionicons";
import { StackTabParamList } from "./HomeNavigator";

const Tab = createBottomTabNavigator<StackTabParamList>();

export default function BottomTab(): React.JSX.Element {
    return(
        <Tab.Navigator initialRouteName="Home"
            screenOptions={ ({ route })=>({
                tabBarIcon: ({ color,size }) =>{
                    const icons : Record<string,'home-outline' | 'scan-outline' | 'add-outline' | 'person-outline'>= {
                        Home: 'home-outline',
                        Scan:'scan-outline',
                        Add:'add-outline',
                        Profile:'person-outline'
                    };
                    return(
                      <Icon
                        name={icons[route.name]}
                        color={color}
                        size={size}
                      />
                    )
                }
            }) }
        >
            <Tab.Screen name='Home' component={HomeScreen}/>
            <Tab.Screen name='Scan' component={ScanScreen}/>
            <Tab.Screen name='Add' component={AddScreen}/>
            <Tab.Screen name='Profile' component={ProfileScreen}/>
        </Tab.Navigator>
    )
}
