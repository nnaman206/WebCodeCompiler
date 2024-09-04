const stubs={};
stubs.java=`import java.util.*;
import java.io.*;
import java.lang.*;
class Start
{
public static void main(String[] args)
{
System.out.println("HELLO WORLD");
}

}
`;
stubs.cpp=`#include <iostream>
#include <fstream>
#include<iostream>
using namespace std;
int main()
{
cout<<"HELLO WORLD"<<endl;
return 0;
}`;
export default stubs;