-- Insert Two Sum problem
INSERT INTO problems (
  id,
  title,
  difficulty,
  category,
  description,
  constraints,
  starter_code_js,
  starter_code_java,
  starter_code_cpp,
  starter_code_py,
  time_limit,
  memory_limit,
  created_at,
  updated_at,
  sample_input,
  sample_output
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Two Sum',
  'Easy',
  'Array',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
  '2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists',
  'function twoSum(nums, target) {
    // Your code here
    return [];
}

const input = JSON.parse(require("fs").readFileSync(0, "utf8"));
const result = twoSum(input.nums, input.target);
console.log("[" + result.join(",") + "]");',
  'import java.util.*;
import java.util.regex.*;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
    
    public static void main(String[] args) {
        try {
            Scanner sc = new Scanner(System.in);
            StringBuilder sb = new StringBuilder();
            while (sc.hasNextLine()) {
                sb.append(sc.nextLine());
            }
            String input = sb.toString();
            
            // Parse JSON manually
            Pattern numsPattern = Pattern.compile("\\\"nums\\\":\\\\s*\\\\[([^\\\\]]+)\\\\]");
            Pattern targetPattern = Pattern.compile("\\\"target\\\":\\\\s*(-?\\\\d+)");
            
            Matcher numsMatcher = numsPattern.matcher(input);
            Matcher targetMatcher = targetPattern.matcher(input);
            
            if (numsMatcher.find() && targetMatcher.find()) {
                String numsStr = numsMatcher.group(1);
                String[] numsArray = numsStr.split(",");
                int[] nums = new int[numsArray.length];
                for (int i = 0; i < numsArray.length; i++) {
                    nums[i] = Integer.parseInt(numsArray[i].trim());
                }
                
                int target = Integer.parseInt(targetMatcher.group(1));
                
                int[] result = twoSum(nums, target);
                
                System.out.print("[");
                for (int i = 0; i < result.length; i++) {
                    System.out.print(result[i]);
                    if (i < result.length - 1) {
                        System.out.print(",");
                    }
                }
                System.out.println("]");
            }
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}',
  '#include <iostream>
#include <vector>
#include <string>
#include <sstream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
    return {};
}

int main() {
    string input;
    getline(cin, input);
    
    // Find nums array
    size_t numsStart = input.find("[");
    size_t numsEnd = input.find("]");
    string numsStr = input.substr(numsStart + 1, numsEnd - numsStart - 1);
    
    // Parse nums array
    vector<int> nums;
    stringstream ss(numsStr);
    string token;
    while (getline(ss, token, '','')) {
        // Remove whitespace
        token.erase(0, token.find_first_not_of(" \\t"));
        token.erase(token.find_last_not_of(" \\t") + 1);
        nums.push_back(stoi(token));
    }
    
    // Find target
    size_t targetPos = input.find("\"target\":");
    size_t targetStart = input.find(":", targetPos) + 1;
    size_t targetEnd = input.find_first_of(",}", targetStart);
    string targetStr = input.substr(targetStart, targetEnd - targetStart);
    
    // Remove whitespace from target
    targetStr.erase(0, targetStr.find_first_not_of(" \\t"));
    targetStr.erase(targetStr.find_last_not_of(" \\t") + 1);
    int target = stoi(targetStr);
    
    vector<int> result = twoSum(nums, target);
    
    cout << "[";
    for (int i = 0; i < result.size(); ++i) {
        cout << result[i];
        if (i != result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}',
  'import sys, json

def twoSum(nums, target):
    # Your code here
    return []

data = json.load(sys.stdin)
result = twoSum(data["nums"], data["target"])
print("[" + ",".join(map(str, result)) + "]")',
  1000,
  128,
  now(),
  now(),
  '{"nums": [2,7,11,15], "target": 9}',
  '[0,1]'
);

-- Insert test cases for Two Sum
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"nums": [2,7,11,15], "target": 9}', '[0,1]', false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"nums": [3,2,4], "target": 6}', '[1,2]', false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"nums": [3,3], "target": 6}', '[0,1]', false),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"nums": [1,5,3,7,9,2], "target": 12}', '[1,3]', true),
('a1b2c3d4-e5f6-7890-abcd-ef1234567890', '{"nums": [-1,-2,-3,-4,-5], "target": -8}', '[2,4]', true);