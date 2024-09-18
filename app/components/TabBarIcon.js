
export default function TabBarIcon(props) {
  
    return (
      <TouchableOpacity style={styles.tab_item} onPress={() => Actions.reset(props.reset)}>
        <Icon
          name={props.name}
          type={props.type}
          size={ 25 }
          style={{ marginBottom: 0, marginTop: 8 }}
          color={props.focused ? '#2C88D9' : '#4B5C6B'}
        />
        <Text style={{color: props.focused ? '#2C88D9' : '#4B5C6B' , marginTop: 4}}>{props.title}</Text>
      </TouchableOpacity>
    );
  
}

const styles = StyleSheet.create({
  tab_item: {
    display:'flex', 
    alignItems: 'center'
  }
});
