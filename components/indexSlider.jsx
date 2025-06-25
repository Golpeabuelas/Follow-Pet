import { Animated, Dimensions, FlatList, Image, Pressable, Text, View } from "react-native";
import { useRef, useState } from "react";
import { IndexSliderData } from "../data/IndexSliderData"

const height = Dimensions.get("window").height;
const width = Dimensions.get("window").width;
const positions = [width*0.33, width*0.4055, width*0.481, width*0.5565, width*0.632]

export default function IndexSlider({ lightMode }) {
    const [backgroundColor, setBackgroundColor] = useState("#E9E9E9");
    const [currentIndex, setCurrentIndex] = useState(0);
    const indicatorPosition = useRef(new Animated.Value(width*0.481)).current;
    const scrollRef = useRef(null);
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: "100%" });
    
    function goToSlide (index) {
        scrollRef.current?.scrollToIndex({ index: index, animated: true });
    }

    const onViewRef = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            Animated.timing(indicatorPosition, {   
                toValue: positions[viewableItems[0].index],
                duration: 100,
                useNativeDriver: false
            }).start();
            setCurrentIndex(viewableItems[0].index);
            if ( viewableItems[0].index == 0 || viewableItems[0].index == 4) {
                setBackgroundColor("#E9E9E9")
                lightMode(true)
            } else {
                setBackgroundColor("#032B30")
                lightMode(false)
            }
        }
    });

    return (
        <View style={{backgroundColor: backgroundColor}} className="w-full h-full flex items-center justify-center">
            <FlatList className="w-full h-full" 
                ref={scrollRef}
                horizontal 
                showsHorizontalScrollIndicator={false} 
                pagingEnabled data={IndexSliderData} 
                keyExtractor={(item) => item.key} 
                onViewableItemsChanged={onViewRef.current}
                viewAreaCoveragePercentThreshold={viewConfigRef.current}
                renderItem={({item}) => ( item.key == 1 ? 
                    <View style={{ width: width, height: height * 0.89 }} className="flex items-center justify-center">
                        <Image source={item.image} className="w-[65%] h-[30%] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-65%]"/>
                        <Text className="text-5xl text-center absolute top-[63%] font-black text-[#B4B444] tracking-widest">{item.title}</Text>
                    </View> : item.key == 5 ? 
        
                    <View style={{ width: width, height: height * 0.89 }} className="flex items-center justify-center">
                        <Text className="z-[1] text-2xl text-center absolute top-[35%] font-black text-black">{item.title}</Text>
                        <Text className="z-[1] text-xl text-center absolute top-[35%]  translate-y-[70%] w-[80%] text-black">{item.message}</Text> 
                        <Pressable className="w-[60%] h-[7%] bg-[#788384] rounded-[15] absolute top-[60%] left-[50%] translate-x-[-50%] items-center justify-center">
                            <Text className="text-2xl font-bold text-[#E9E9E9]">Empezar sin sesión</Text>    
                        </Pressable>
                    </View> :
                    
                    <View style={{ width: width, height: height * 0.89 }} className="flex items-center justify-center">
                        <Image source={item.image} className="w-[60%] h-[60%] opacity-[0.4] scale-x-[-1.1] rotate-[8deg] z-[0] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"/>
                        <Text className="z-[1] text-xl text-center absolute top-[50%] font-bold text-white">{item.title}</Text>
                        <Text className="z-[1] text-xl text-center absolute top-[50%] translate-y-[70%] w-[80%] text-white">{item.message}</Text> 
                    </View>
            )}/>
            
            <View className="w-[80%] h-[10%] flex-row px-[23%] absolute top-[80%] justify-between items-center z-[1]">
                {[0,1,2,3,4].map((i) => {
                    return (
                        <Pressable key={i} style={{width: width*0.038, height: width*0.038}} className="bg-[#FFF] rounded-full z-[0]" onPress={() => goToSlide(i, positions[i])}>
                            <View style={{width: width*0.04, height: width*0.04}} className="bg-white rounded-full top-[15%] opacity-[0.3] z-[0]"></View>
                        </Pressable>
                    )
                })}
            </View>

            <Animated.View style={{width: width*0.038, height: width*0.038, left: indicatorPosition}} className="absolute top-[84.03%] bg-[#FFBD59] rounded-full z-[1]"/>
        </View>
    )
}