import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import theme from '../../../../theme/theme';
import { MMKV } from '../../../../storage';
import { setSettings } from '../../../../store/features/playerSlice';
import { useDispatch } from 'react-redux';
import { updateSettings } from '../../../../utils/play';



const DropdownComponent = ({ data, label, name }) => {
    const [value, setValue] = useState('1')
    const [isFocus, setIsFocus] = useState(false);

    const dispatch = useDispatch()

    useEffect(() => {
        const settings = MMKV.getMap('settings');
        if (settings) {
            setValue(settings[label])
        }
    }, [])

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: theme.brand }]}>
                    {label}
                </Text>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: theme.brand }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                activeColor={theme.syGray}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={data}
                containerStyle={{
                    marginTop: -55,
                    backgroundColor: theme.sy
                }}
                maxHeight={120}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Low' : '...'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);

                    let oldSettings = MMKV.getMap('settings');
                    let obj = {}

                    if (oldSettings) {
                        oldSettings[label] = item.value
                        obj = oldSettings
                    } else {
                        obj[label] = item.value
                    }

                    MMKV.setMap('settings', obj);
                    dispatch(setSettings(obj))
                    updateSettings()
                }}
                renderLeftIcon={() => (
                    <MaterialIcons
                        style={styles.icon}
                        color={isFocus ? theme.brand : theme.txtSy}
                        name={name}
                        size={20}
                    />
                )}
            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    dropdown: {
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        color: theme.txt,
        backgroundColor: theme.sy,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        left: 22,
        backgroundColor: theme.sy,
        borderRadius: 8,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: theme.txt,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});