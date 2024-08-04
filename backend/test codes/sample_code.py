'''
# Python program to find the factorial of a number provided by the user.

# change the value for a different result
#num = 7

# To take input from the user
num = int(input())

factorial = 1

# check if the number is negative, positive or zero
if num < 0:
   print("Sorry, factorial does not exist for negative numbers")
elif num == 0:
   print("The factorial of 0 is 1")
else:
   for i in range(1,num + 1):
       factorial = factorial*i
   print("The factorial of",num,"is",factorial)
'''
'''
# Function for nth Fibonacci number

def Fibonacci(n):
	if n<= 0:
		print("Incorrect input")
	# First Fibonacci number is 0
	elif n == 1:
		return 1
	# Second Fibonacci number is 1
	elif n == 2:
		return 1
	else:
		return Fibonacci(n-1)+Fibonacci(n-2)

# Driver Program

print(Fibonacci(int(input())))

# This code is contributed by Saket Modi
'''

#TOTCRT from codechef

t=1
while(t!=0):
    n=int(input())
    distinct_problems={}
    for i in range(3*n):
        k,m=input().split()
        if k not in distinct_problems.keys():
            distinct_problems[k]=int(m)
        else:
            distinct_problems[k]+=int(m)
    l=dict(sorted(distinct_problems.items(), key=lambda item: item[1]))
    for i in l.values():
        print(i,end=" ")
    print("\n")
    t-=1
    
